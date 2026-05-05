import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/style_my_orders.css";

// Giả lập dữ liệu đơn hàng chi tiết hơn
const MOCK_ORDERS = [
  { 
    id: "DH-1001", 
    date: "2026-05-05 09:30", 
    status: "new", 
    total: 150000, 
    items: [
      { name: "Pizza Hải Sản", quantity: 1, price: 120000, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100" },
      { name: "Coca Cola", quantity: 2, price: 15000, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100" }
    ],
    address: "123 Đường ABC, Quận 1, TP.HCM",
    payment: "Tiền mặt (COD)"
  },
  { 
    id: "DH-1002", 
    date: "2026-05-04 12:15", 
    status: "completed", 
    total: 55000, 
    items: [
      { name: "Trà sữa Trân Châu", quantity: 2, price: 27500, image: "https://images.unsplash.com/photo-1544787210-2213d6439977?w=100" }
    ],
    address: "456 Đường XYZ, Quận 7, TP.HCM",
    payment: "ZaloPay"
  },
  { 
    id: "DH-1003", 
    date: "2026-05-03 18:45", 
    status: "cancelled", 
    total: 120000, 
    items: [
      { name: "Gà rán phần lớn", quantity: 1, price: 120000, image: "https://images.unsplash.com/photo-1562967914-608f82629710?w=100" }
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
              <div className="no-orders">
                <i className="fa-solid fa-folder-open"></i>
                <p>Chưa có đơn hàng nào trong trạng thái này.</p>
              </div>
            ) : (
              orders.map(order => (
                <div className="order-card" key={order.id}>
                  <div className="order-card-header">
                    <div>
                      <span className="order-id">Mã ĐH: {order.id}</span>
                      <div className="order-date"><i className="fa-regular fa-clock"></i> {order.date}</div>
                    </div>
                    <span className={`order-status status-${order.status}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <div className="order-card-body">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div className="order-item-summary" key={index}>
                        <div className="item-info">
                          <img src={item.image} alt={item.name} className="item-thumb" />
                          <span>{item.quantity}x {item.name}</span>
                        </div>
                        <span>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</span>
                      </div>
                    ))}
                    {order.items.length > 2 && <p className="more-items">...và {order.items.length - 2} món khác</p>}
                  </div>

                  <div className="order-card-footer">
                    <div className="order-total">
                      Tổng tiền: <span>{order.total.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <button className="btn-view-detail" onClick={() => openDetail(order)}>
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="modal show" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content order-detail-modal" onClick={e => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</span>
            <h3><i className="fa-solid fa-receipt"></i> Chi tiết đơn hàng {selectedOrder.id}</h3>
            
            <div className="order-detail-content">
              <div className="detail-section">
                <h4><i className="fa-solid fa-info-circle"></i> Thông tin chung</h4>
                <p><strong>Ngày đặt:</strong> {selectedOrder.date}</p>
                <p><strong>Trạng thái:</strong> <span className={`order-status status-${selectedOrder.status}`}>{getStatusText(selectedOrder.status)}</span></p>
                <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                <p><strong>Thanh toán:</strong> {selectedOrder.payment}</p>
              </div>

              <div className="detail-section">
                <h4><i className="fa-solid fa-bowl-food"></i> Danh sách món ăn</h4>
                <div className="detail-items">
                  {selectedOrder.items.map((item: any, i: number) => (
                    <div className="detail-item" key={i}>
                      <img src={item.image} alt={item.name} className="detail-item-img" />
                      <div className="detail-item-info">
                        <h5>{item.name}</h5>
                        <p>{item.quantity} x {item.price.toLocaleString("vi-VN")}đ</p>
                      </div>
                      <span className="detail-item-subtotal">{(item.quantity * item.price).toLocaleString("vi-VN")}đ</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-total">
                <span>Tổng cộng:</span>
                <span>{selectedOrder.total.toLocaleString("vi-VN")}đ</span>
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
