import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../assets/css/style_my_orders.css";

const MOCK_ORDERS = [
  { 
    id: "ORD1777951428457", 
    date: "10:23 05/05/2026", 
    status: "new", 
    total: 60000, 
    restaurant: "Nhà Hàng Chay Tâm An",
    items: [
      { name: "Nấm sốt đông x3", quantity: 1, price: 60000 }
    ],
    customerName: "Nguyễn Duy Huy",
    phone: "0987654321",
    address: "á",
    note: "aa",
    payment: "Thanh toán khi nhận hàng (COD)"
  },
  { 
    id: "ORD177684267409", 
    date: "14:24 22/04/2026", 
    status: "assigned", 
    total: 180000, 
    restaurant: "Nhà Hàng Gia Đình",
    items: [
      { name: "Gà chiên mắm x2", quantity: 1, price: 120000 },
      { name: "Sườn ram mặn x2", quantity: 1, price: 60000 }
    ],
    customerName: "Nguyễn Duy Huy",
    phone: "0987654321",
    address: "Khoái Châu",
    note: "",
    payment: "Thanh toán khi nhận hàng (COD)"
  }
];

const MyOrders: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orders = filter === "all" ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === filter);

  const getStatusText = (status: string) => {
    switch (status) {
      case "new": return "ĐƠN MỚI";
      case "confirmed": return "ĐÃ XÁC NHẬN";
      case "preparing": return "ĐANG CHUẨN BỊ";
      case "ready": return "SẴN SÀNG GIAO";
      case "assigned": return "ĐANG GIAO HÀNG";
      case "completed": return "HOÀN THÀNH";
      case "cancelled": return "ĐÃ HỦY";
      default: return "KHÔNG XÁC ĐỊNH";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new": return "fa-circle-info";
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
                      <h4><i className="fa-solid fa-receipt"></i> Đơn hàng #{order.id}</h4>
                      <span className="order-date">{order.date}</span>
                    </div>
                    <div className={`order-status-badge status-${order.status}`}>
                      <i className={`fa-solid ${getStatusIcon(order.status)}`}></i> {getStatusText(order.status)}
                    </div>
                  </div>
                  
                  <div className="order-card-body">
                    <div className="order-info-row">
                      <i className="fa-solid fa-store"></i>
                      <span>Nhà hàng: {order.restaurant}</span>
                    </div>
                    <div className="order-info-row">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>Địa chỉ giao: {order.address}</span>
                    </div>
                    <div className="order-info-row">
                      <i className="fa-solid fa-money-bill-wave"></i>
                      <span className="order-total">Tổng tiền: {order.total.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                    
                    <div className="order-items-preview">
                      <strong>Món ăn:</strong>
                      <div className="items-list">
                        {order.items.map((item, index) => (
                          <span className="item-tag" key={index}>
                            {item.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    <button className="btn-view-detail" onClick={() => openDetail(order)}>
                      <i className="fa-solid fa-eye"></i> Xem chi tiết
                    </button>
                    <button className="btn-cancel-order" style={{ marginLeft: "10px" }} onClick={() => alert("Hủy đơn thành công!")}>
                       <i className="fa-solid fa-xmark"></i> Hủy đơn
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content order-detail-modal" onClick={e => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setIsModalOpen(false)}>&times;</span>
            
            <h2><i className="fa-solid fa-receipt"></i> Chi tiết đơn hàng</h2>
            
            <div className="order-detail-content">
              {/* Section 1: Thông tin đơn hàng */}
              <div className="detail-section">
                <h4><i className="fa-solid fa-circle-info"></i> Thông tin đơn hàng</h4>
                <div className="detail-row">
                  <span className="detail-label">Mã đơn hàng:</span>
                  <span className="detail-value">{selectedOrder.id}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Trạng thái:</span>
                  <span className={`order-status-badge status-${selectedOrder.status}`}>
                    <i className={`fa-solid ${getStatusIcon(selectedOrder.status)}`}></i> {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Nhà hàng:</span>
                  <span className="detail-value">{selectedOrder.restaurant}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Thời gian đặt:</span>
                  <span className="detail-value">{selectedOrder.date}</span>
                </div>
              </div>

              {/* Section 2: Thông tin giao hàng */}
              <div className="detail-section">
                <h4><i className="fa-solid fa-user"></i> Thông tin giao hàng</h4>
                <div className="detail-row">
                  <span className="detail-label">Người nhận:</span>
                  <span className="detail-value">{selectedOrder.customerName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Số điện thoại:</span>
                  <span className="detail-value">{selectedOrder.phone}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Địa chỉ:</span>
                  <span className="detail-value">{selectedOrder.address}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Ghi chú:</span>
                  <span className="detail-value">{selectedOrder.note || "---"}</span>
                </div>
              </div>

              {/* Section 3: Danh sách món ăn */}
              <div className="detail-section">
                <h4><i className="fa-solid fa-list-ul"></i> Danh sách món ăn</h4>
                <div className="detail-items-list">
                  {selectedOrder.items.map((item: any, i: number) => (
                    <div className="detail-item-line" key={i}>
                      <span className="detail-item-name">{item.name}</span>
                      <span className="detail-item-price">{item.price.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Thanh toán */}
              <div className="detail-section payment-section">
                <h4><i className="fa-solid fa-credit-card"></i> Thanh toán</h4>
                <div className="detail-row">
                  <span className="detail-label">Phương thức:</span>
                  <span className="detail-value">{selectedOrder.payment}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tổng tiền:</span>
                  <span className="total-bold">{selectedOrder.total.toLocaleString("vi-VN")} VNĐ</span>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="modal-footer-actions" style={{ marginTop: "10px", display: "flex", justifyContent: "flex-end" }}>
                <button className="btn-cancel-order" onClick={() => { alert("Hủy đơn thành công!"); setIsModalOpen(false); }}>
                  <i className="fa-solid fa-xmark"></i> Hủy đơn hàng này
                </button>
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
