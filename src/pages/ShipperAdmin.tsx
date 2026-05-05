import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { formatDateTime } from "../utils/order";
import "../assets/css/style_shipper.css";

const ShipperAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "pending" | "my-orders" | "completed" | "statistics">("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filter, setFilter] = useState<"all" | "picking" | "delivering">("all");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      setCurrentUser(user);
    }
    
    loadAndSyncOrders();
    const interval = setInterval(loadAndSyncOrders, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadAndSyncOrders = () => {
    // 1. Đọc từ shipper_orders
    let shipperOrders = JSON.parse(localStorage.getItem('shipper_orders') || '[]');
    
    // 2. Đồng bộ từ restaurant_orders (Các đơn đã được nhà hàng bàn giao - 'assigned')
    const restaurantOrders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
    const assignedOrders = restaurantOrders.filter((o: any) => o.restaurantStatus === 'assigned');

    assignedOrders.forEach((rOrder: any) => {
      const idx = shipperOrders.findIndex((o: any) => o.id === rOrder.id);
      if (idx >= 0) {
        // Nếu shipper chưa nhận đơn này, cập nhật toàn bộ từ nhà hàng
        if (!shipperOrders[idx].shipperId) {
          shipperOrders[idx] = { ...rOrder, status: rOrder.status || 'pending' };
        } else {
          // Nếu đã nhận, chỉ cập nhật thông tin nhà hàng và trạng thái nhà hàng
          shipperOrders[idx].assignedTo = rOrder.assignedTo;
          shipperOrders[idx].restaurantStatus = rOrder.restaurantStatus;
        }
      } else {
        // Đơn mới từ nhà hàng
        shipperOrders.push({ ...rOrder, status: rOrder.status || 'pending' });
      }
    });

    localStorage.setItem('shipper_orders', JSON.stringify(shipperOrders));
    setOrders(shipperOrders);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    if (!currentUser) return;

    let allOrders = JSON.parse(localStorage.getItem('shipper_orders') || '[]');
    const order = allOrders.find((o: any) => o.id === orderId);
    
    if (!order) return;

    // Cập nhật thông tin shipper và trạng thái
    order.status = newStatus;
    if (newStatus === 'picking') {
      order.shipperId = currentUser.username;
      order.acceptedAt = new Date().toISOString();
    } else if (newStatus === 'delivering') {
      order.deliveringAt = new Date().toISOString();
    } else if (newStatus === 'completed') {
      order.completedAt = new Date().toISOString();
      order.restaurantStatus = 'completed';
    }

    // Đồng bộ lại tất cả các bảng
    localStorage.setItem('shipper_orders', JSON.stringify(allOrders));
    
    // Đồng bộ restaurant_orders
    const restaurantOrders = JSON.parse(localStorage.getItem('restaurant_orders') || '[]');
    const rIdx = restaurantOrders.findIndex((o: any) => o.id === orderId);
    if (rIdx >= 0) {
      restaurantOrders[rIdx] = { ...restaurantOrders[rIdx], ...order };
      localStorage.setItem('restaurant_orders', JSON.stringify(restaurantOrders));
    }

    // Đồng bộ customer_orders (để khách xem được)
    const customerOrders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
    const cIdx = customerOrders.findIndex((o: any) => o.id === orderId);
    if (cIdx >= 0) {
      customerOrders[cIdx] = { ...customerOrders[cIdx], ...order };
      localStorage.setItem('customer_orders', JSON.stringify(customerOrders));
    }

    setOrders(allOrders);
    if (selectedOrder?.id === orderId) setSelectedOrder({ ...order });
    
    alert('Cập nhật trạng thái thành công!');
  };

  // Logic lọc đơn hàng
  const pendingOrders = orders.filter(o => 
    o.restaurantStatus === 'assigned' && 
    (!o.shipperId) && 
    (!o.assignedTo || o.assignedTo.toLowerCase() === currentUser?.username?.toLowerCase())
  );

  const myOrders = orders.filter(o => 
    o.shipperId === currentUser?.username && 
    (o.status === 'picking' || o.status === 'delivering')
  );

  const completedOrders = orders.filter(o => 
    o.shipperId === currentUser?.username && 
    o.status === 'completed'
  );

  const stats = {
    pending: pendingOrders.length,
    inProgress: myOrders.length,
    completed: completedOrders.length,
    earnings: completedOrders.reduce((sum, o) => sum + (o.total * 0.1), 0) // 10% hoa hồng
  };

  const renderOrderCard = (order: any) => (
    <div key={order.id} className="shipper-order-card" onClick={() => setSelectedOrder(order)}>
      <div className="shipper-order-header">
        <span className="shipper-order-id">Đơn hàng #{order.id}</span>
        <span className={`shipper-order-status ${order.status}`}>
          {order.status === 'pending' ? 'Chờ nhận' : 
           order.status === 'picking' ? 'Đang lấy hàng' : 
           order.status === 'delivering' ? 'Đang giao' : 'Đã giao'}
        </span>
      </div>
      <div className="shipper-order-info">
        <div className="shipper-info-item">
          <i className="fa-solid fa-user"></i>
          <span><strong>Khách hàng:</strong> {order.customerName}</span>
        </div>
        <div className="shipper-info-item">
          <i className="fa-solid fa-location-dot"></i>
          <span><strong>Địa chỉ:</strong> {order.customerAddress || order.address}</span>
        </div>
        <div className="shipper-info-item">
          <i className="fa-solid fa-clock"></i>
          <span><strong>Thời gian:</strong> {formatDateTime(new Date(order.createdAt || order.date))}</span>
        </div>
      </div>
      <div className="shipper-order-total">
        Tổng tiền: {order.total.toLocaleString()} VNĐ
      </div>
      <div className="shipper-order-actions">
        {order.status === 'pending' && (
          <button className="shipper-btn-action shipper-btn-accept" onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'picking'); }}>Nhận đơn</button>
        )}
        {order.status === 'picking' && (
          <button className="shipper-btn-action shipper-btn-delivering" onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'delivering'); }}>Bắt đầu giao</button>
        )}
        {order.status === 'delivering' && (
          <button className="shipper-btn-action shipper-btn-complete" onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.id, 'completed'); }}>Hoàn thành</button>
        )}
        <button className="shipper-btn-action shipper-btn-detail">Chi tiết</button>
      </div>
    </div>
  );

  return (
    <div className="shipper-page">
      <Header />
      <div className="shipper-admin-container">
        <div className="shipper-sidebar">
          <nav className="shipper-menu">
            <div className={`shipper-menu-item ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>
              <i className="fa-solid fa-chart-line"></i> <span>Dashboard</span>
            </div>
            <div className={`shipper-menu-item ${activeTab === "pending" ? "active" : ""}`} onClick={() => setActiveTab("pending")}>
              <i className="fa-solid fa-clock"></i> <span>Đơn hàng chờ</span>
              {stats.pending > 0 && <span className="shipper-badge">{stats.pending}</span>}
            </div>
            <div className={`shipper-menu-item ${activeTab === "my-orders" ? "active" : ""}`} onClick={() => setActiveTab("my-orders")}>
              <i className="fa-solid fa-motorcycle"></i> <span>Đơn hàng của tôi</span>
              {stats.inProgress > 0 && <span className="shipper-badge">{stats.inProgress}</span>}
            </div>
            <div className={`shipper-menu-item ${activeTab === "completed" ? "active" : ""}`} onClick={() => setActiveTab("completed")}>
              <i className="fa-solid fa-check-circle"></i> <span>Đã giao</span>
            </div>
            <div className={`shipper-menu-item ${activeTab === "statistics" ? "active" : ""}`} onClick={() => setActiveTab("statistics")}>
              <i className="fa-solid fa-chart-pie"></i> <span>Thống kê</span>
            </div>
          </nav>
        </div>

        <div className="shipper-content">
          {activeTab === "dashboard" && (
            <section id="dashboard">
              <div className="shipper-welcome">
                <h3>Chào mừng, {currentUser?.fullname || currentUser?.username || 'Shipper'}!</h3>
                <p>Quản lý đơn hàng giao của bạn một cách hiệu quả</p>
              </div>
              <div className="shipper-stats">
                <div className="shipper-card" onClick={() => setActiveTab("pending")}>
                  <i className="fa-solid fa-clock"></i>
                  <span>{stats.pending}</span> <p>Đơn hàng chờ</p>
                </div>
                <div className="shipper-card" onClick={() => setActiveTab("my-orders")}>
                  <i className="fa-solid fa-motorcycle"></i>
                  <span>{stats.inProgress}</span> <p>Đang giao</p>
                </div>
                <div className="shipper-card" onClick={() => setActiveTab("completed")}>
                  <i className="fa-solid fa-check-circle"></i>
                  <span>{stats.completed}</span> <p>Đã giao</p>
                </div>
                <div className="shipper-card">
                  <i className="fa-solid fa-money-bill-wave"></i>
                  <span>{stats.earnings.toLocaleString()}đ</span> <p>Thu nhập (10%)</p>
                </div>
              </div>
            </section>
          )}

          {activeTab === "pending" && (
            <section id="pending-orders">
              <div className="shipper-section-header">
                <h3>Đơn hàng chờ nhận</h3>
                <button className="shipper-btn-refresh" onClick={loadAndSyncOrders}>Làm mới</button>
              </div>
              <div className="shipper-orders-list">
                {pendingOrders.length > 0 ? pendingOrders.map(renderOrderCard) : <p className="shipper-empty-state">Không có đơn hàng chờ</p>}
              </div>
            </section>
          )}

          {activeTab === "my-orders" && (
            <section id="my-orders">
              <div className="shipper-section-header">
                <h3>Đơn hàng của tôi</h3>
                <div className="shipper-filter-tabs">
                  <button className={`shipper-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tất cả</button>
                  <button className={`shipper-filter-btn ${filter === 'picking' ? 'active' : ''}`} onClick={() => setFilter('picking')}>Đang lấy</button>
                  <button className={`shipper-filter-btn ${filter === 'delivering' ? 'active' : ''}`} onClick={() => setFilter('delivering')}>Đang giao</button>
                </div>
              </div>
              <div className="shipper-orders-list">
                {myOrders.filter(o => filter === 'all' || o.status === filter).length > 0 ? 
                  myOrders.filter(o => filter === 'all' || o.status === filter).map(renderOrderCard) : 
                  <p className="shipper-empty-state">Không có đơn hàng</p>}
              </div>
            </section>
          )}

          {activeTab === "completed" && (
            <section id="completed-orders">
              <div className="shipper-section-header"><h3>Lịch sử đã giao</h3></div>
              <div className="shipper-orders-list">
                {completedOrders.length > 0 ? completedOrders.map(renderOrderCard) : <p className="shipper-empty-state">Chưa có đơn hoàn thành</p>}
              </div>
            </section>
          )}

          {activeTab === "statistics" && (
            <section id="statistics">
              <div className="shipper-section-header"><h3>Thống kê</h3></div>
              <div className="shipper-stats-grid">
                <div className="shipper-stat-card"><h4>Tổng đơn đã giao</h4><p>{stats.completed}</p></div>
                <div className="shipper-stat-card"><h4>Tổng thu nhập</h4><p>{stats.earnings.toLocaleString()}đ</p></div>
                <div className="shipper-stat-card"><h4>Đánh giá</h4><p>4.9 <i className="fa-solid fa-star"></i></p></div>
              </div>
            </section>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div className="shipper-modal" onClick={() => setSelectedOrder(null)}>
          <div className="shipper-modal-content" onClick={e => e.stopPropagation()}>
            <span className="shipper-close-modal" onClick={() => setSelectedOrder(null)}>&times;</span>
            <h3>Chi tiết #{selectedOrder.id}</h3>
            <p><strong>Khách:</strong> {selectedOrder.customerName}</p>
            <p><strong>SĐT:</strong> {selectedOrder.customerPhone || selectedOrder.phone}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.customerAddress || selectedOrder.address}</p>
            <p><strong>Quán:</strong> {selectedOrder.restaurant}</p>
            <hr />
            {selectedOrder.items.map((item: any, idx: number) => (
              <div key={idx} style={{display:'flex', justifyContent:'space-between'}}>
                <span>{item.name} x{item.quantity}</span>
                <span>{(item.price * item.quantity).toLocaleString()}đ</span>
              </div>
            ))}
            <p style={{textAlign:'right', fontWeight:'bold', marginTop:'10px', color:'var(--orange)'}}>Tổng: {selectedOrder.total.toLocaleString()}đ</p>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ShipperAdmin;
