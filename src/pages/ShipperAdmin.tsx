import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { formatDateTime } from "../utils/order";
import "../assets/css/style_shipper.css";
import axiosClient from "../utils/api";

const ShipperAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "pending" | "my-orders" | "completed" | "statistics">("dashboard");
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [filter, setFilter] = useState<"all" | "picking" | "delivering">("all");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }
    
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Tự động làm mới mỗi 10 giây
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      // 1. Lấy đơn hàng đang chờ (chưa có ai nhận)
      const pendingRes = await axiosClient.get('/shipping/pending');
      if (pendingRes.data.success) setPendingOrders(pendingRes.data.data);

      // 2. Lấy đơn hàng của shipper hiện tại
      const myTasksRes = await axiosClient.get('/shipping/my-tasks');
      if (myTasksRes.data.success) setMyTasks(myTasksRes.data.data);

    } catch (error) {
      console.error("Lỗi khi tải đơn hàng cho Shipper:", error);
    }
  };

  const handleReceiveOrder = async (orderId: number) => {
    if (window.confirm("Bạn muốn nhận đơn hàng này?")) {
      try {
        const res = await axiosClient.put(`/shipping/${orderId}/receive`);
        if (res.data.success) {
          alert("Đã nhận đơn thành công!");
          fetchOrders();
        }
      } catch (error: any) {
        alert(error.response?.data?.message || "Lỗi khi nhận đơn");
      }
    }
  };

  const handleCompleteOrder = async (orderId: number) => {
    if (window.confirm("Xác nhận đã giao hàng thành công?")) {
      try {
        const res = await axiosClient.put(`/shipping/${orderId}/complete`);
        if (res.data.success) {
          alert("Chúc mừng bạn đã hoàn thành đơn hàng!");
          fetchOrders();
        }
      } catch (error: any) {
        alert(error.response?.data?.message || "Lỗi khi cập nhật");
      }
    }
  };

  const activeMyOrders = myTasks.filter(o => o.trangThai !== 'DaGiao' && o.trangThai !== 'Huy');
  const completedOrders = myTasks.filter(o => o.trangThai === 'DaGiao');

  const stats = {
    pending: pendingOrders.length,
    inProgress: activeMyOrders.length,
    completed: completedOrders.length,
    earnings: completedOrders.reduce((sum, o) => sum + (o.tongTien * 0.1), 0)
  };

  const renderOrderCard = (order: any) => (
    <div key={order.maDonHang} className="shipper-order-card" onClick={() => setSelectedOrder(order)}>
      <div className="shipper-order-header">
        <span className="shipper-order-id">Đơn hàng #{order.maDonHang}</span>
        <span className={`shipper-order-status ${order.trangThai?.toLowerCase()}`}>
          {order.trangThai === 'SanSangGiao' ? 'Sẵn sàng' : 
           order.trangThai === 'DangGiao' ? 'Đang giao' : 
           order.trangThai === 'DaGiao' ? 'Đã giao' : order.trangThai}
        </span>
      </div>
      <div className="shipper-order-info">
        <div className="shipper-info-item">
          <i className="fa-solid fa-location-dot"></i>
          <span><strong>Địa chỉ:</strong> {order.diaChiGiao}</span>
        </div>
        <div className="shipper-info-item">
          <i className="fa-solid fa-clock"></i>
          <span><strong>Ngày đặt:</strong> {new Date(order.ngayDat).toLocaleString()}</span>
        </div>
      </div>
      <div className="shipper-order-total">
        Tổng tiền: {order.tongTien?.toLocaleString()} VNĐ
      </div>
      <div className="shipper-order-actions">
        {order.trangThai === 'SanSangGiao' && (
          <button className="shipper-btn-action shipper-btn-accept" onClick={(e) => { e.stopPropagation(); handleReceiveOrder(order.maDonHang); }}>Nhận đơn</button>
        )}
        {order.trangThai === 'DangGiao' && (
          <button className="shipper-btn-action shipper-btn-complete" onClick={(e) => { e.stopPropagation(); handleCompleteOrder(order.maDonHang); }}>Hoàn thành</button>
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
                <h3>Chào mừng, {currentUser?.hoTen || currentUser?.username || 'Shipper'}!</h3>
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
                <button className="shipper-btn-refresh" onClick={fetchOrders}>Làm mới</button>
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
              </div>
              <div className="shipper-orders-list">
                {activeMyOrders.length > 0 ? 
                  activeMyOrders.map(renderOrderCard) : 
                  <p className="shipper-empty-state">Không có đơn hàng nào đang giao</p>}
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
