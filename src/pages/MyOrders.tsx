import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/style_my_orders.css";

const MOCK_ORDERS = [
  { 
    id: "DH-1001", 
    date: "05/05/2026 09:30", 
    status: "new", 
    total: 150000, 
    items: [
      { name: "Pizza Hải Sản", quantity: 1, price: 120000 },
      { name: "Coca Cola", quantity: 2, price: 15000 }
    ],
    address: "123 Đường ABC, Quận 1, TP.HCM",
    payment: "Tiền mặt (COD)"
  },
  { 
    id: "DH-1002", 
    date: "04/05/2026 12:15", 
    status: "completed", 
    total: 55000, 
    items: [
      { name: "Trà sữa Trân Châu", quantity: 2, price: 27500 }
    ],
    address: "456 Đường XYZ, Quận 7, TP.HCM",
    payment: "ZaloPay"
  },
  { 
    id: "DH-1003", 
    date: "03/05/2026 18:45", 
    status: "cancelled", 
    total: 120000, 
    items: [
      { name: "Gà rán phần lớn", quantity: 1, price: 120000 }
    ],
    address: "789 Đường LMN, Quận Bình Thạnh, TP.HCM",
    payment: "Chuyển khoản"
  }
];

const MyOrders: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orders = filter === "all" ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter);

  const getStatusText = (status: string) => {
    switch (status) {
      case "new": return "Đơn mới";
      case "confirmed": return "Đã xác nhận";
      case "preparing": return "Đang chuẩn bị";
      case "ready": return "Sẵn sàng giao";
      case "assigned": return "Đang giao";
      case "completed": return "Hoàn thành";
      case "cancelled": return "Đã hủy";
      default: return "Không xác định";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return "fa-clock";
      case "confirmed": return "fa-check";
      case "preparing": return "fa-utensils";
      case "ready": return "fa-check-circle";
      case "assigned": return "fa-truck";
      case "completed": return "fa-check-double";
      case "cancelled": return "fa-times-circle";
      default: return "fa-info-circle";
    }
  };

  const openDetail = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  return (
    <>
      <Header />
      <div className="main">
        <div className="container">
          <div className="orders-page-header">
            <h2><i className="fa-solid fa-clipboard-list"></i> Đơn hàng của tôi</h2>
            <p>Theo dõi tất cả đơn hàng của bạn</p>
          </div>

          <div className="orders-filter-tabs">
            {[
              { id: "all", icon: "fa-list", label: "Tất cả" },
              { id: "new", icon: "fa-clock", label: "Đơn mới" },
              { id: "confirmed", icon: "fa-check", label: "Đã xác nhận" },
              { id: "preparing", icon: "fa-utensils", label: "Đang chuẩn bị" },
              { id: "ready", icon: "fa-check-circle", label: "Sẵn sàng giao" },
              { id: "assigned", icon: "fa-truck", label: "Đang giao" },
              { id: "completed", icon: "fa-check-double", label: "Hoàn thành" },
              { id: "cancelled", icon: "fa-times-circle", label: "Đã hủy" }
            ].map(tab => (
              <button 
                key={tab.id}
                className={`filter-tab ${filter === tab.id ? "active" : ""}`}
                onClick={() => setFilter(tab.id)}
              >
                <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
              </button>
            ))}
          </div>

          <div className="orders-list-container">
            {orders.length === 0 ? (
              <div className="empty-orders">
                <i className="fa-solid fa-folder-open"></i>
                <h3>Chưa có đơn hàng nào</h3>
                <p>Bạn chưa có đơn hàng nào trong trạng thái này.</p>
              </div>
            ) : (
              orders.map(order => (
                <div className="customer-order-card" key={order.id}>
                  <div className="order-card-header">
                    <div className="order-id-section">
                      <h4><i className="fa-solid fa-receipt"></i> {order.id}</h4>
                      <span className="order-date">{order.date}</span>
                    </div>
                    <div className={`order-status-badge status-${order.status}`}>
                      <i className={`fa-solid ${getStatusIcon(order.status)}`}></i> {getStatusText(order.status)}
                    </div>
                  </div>
                  
                  <div className="order-card-body">
                    <div className="order-info-row">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>Địa chỉ: {order.address}</span>
                    </div>
                    <div className="order-info-row">
                      <i className="fa-solid fa-credit-card"></i>
                      <span>Thanh toán: {order.payment}</span>
                    </div>
                    <div className="order-info-row">
                      <i className="fa-solid fa-money-bill-wave"></i>
                      <span className="order-total">Tổng tiền: {order.total.toLocaleString("vi-VN")}đ</span>
                    </div>
                    
                    <div className="order-items-preview">
                      <strong>Sản phẩm:</strong>
                      <div className="items-list">
                        {order.items.map((item, index) => (
                          <span className="item-tag" key={index}>
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    <button className="btn-view-detail" onClick={() => openDetail(order)}>
                      <i className="fa-solid fa-eye"></i> Xem chi tiết
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="modal" style={{ display: "block" }} onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</span>
            <div className="order-form-modal">
              <h2><i className="fa-solid fa-receipt"></i> Chi tiết đơn hàng {selectedOrder.id}</h2>
              
              <div className="order-detail-section">
                <h4><i className="fa-solid fa-info-circle"></i> Thông tin chung</h4>
                <div className="order-detail-item"><strong>Ngày đặt:</strong> {selectedOrder.date}</div>
                <div className="order-detail-item">
                  <strong>Trạng thái:</strong> 
                  <span className={`order-status-badge status-${selectedOrder.status}`} style={{ marginLeft: "10px" }}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div className="order-detail-item"><strong>Địa chỉ:</strong> {selectedOrder.address}</div>
                <div className="order-detail-item"><strong>Thanh toán:</strong> {selectedOrder.payment}</div>
              </div>

              <div className="order-detail-section">
                <h4><i className="fa-solid fa-bowl-food"></i> Danh sách món ăn</h4>
                <div className="order-summary">
                  {selectedOrder.items.map((item: any, i: number) => (
                    <div className="order-summary-item" key={i}>
                      <span className="item-name">{item.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                      <span className="item-price">{(item.quantity * item.price).toLocaleString("vi-VN")}đ</span>
                    </div>
                  ))}
                  <div className="order-total-summary">
                    <strong>Tổng cộng: <span>{selectedOrder.total.toLocaleString("vi-VN")}đ</span></strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default MyOrders;
