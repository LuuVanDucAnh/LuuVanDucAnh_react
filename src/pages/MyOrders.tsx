import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axiosClient from "../utils/api";
import "../assets/css/style_my_orders.css";

const MyOrders: React.FC = () => {
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders();
  }, [filter]);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      // Gọi API lấy danh sách đơn hàng của khách hiện tại
      // Backend hỗ trợ lọc qua query string ?status=...
      const statusParam = filter === "all" ? "" : `?status=${filter}`;
      const res = await axiosClient.get(`/orders/Order/laydanhsachdonhang${statusParam}`);
      if (res.data.success) {
        setOrdersData(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      try {
        const res = await axiosClient.put(`/orders/Order/${orderId}/huydonhangdat`);
        if (res.data.success) {
          alert("Hủy đơn hàng thành công!");
          fetchMyOrders();
          setIsModalOpen(false);
        }
      } catch (error: any) {
        alert(error.response?.data?.message || "Lỗi khi hủy đơn hàng");
      }
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ChoXacNhan": return "ĐANG CHỜ";
      case "DaXacNhan": return "ĐÃ XÁC NHẬN";
      case "DangChuanBi": return "ĐANG CHUẨN BỊ";
      case "SanSangGiao": return "SẴN SÀNG";
      case "DangGiao": return "ĐANG GIAO";
      case "DaGiao": return "HOÀN THÀNH";
      case "Huy": return "ĐÃ HỦY";
      default: return status?.toUpperCase() || "KHÔNG XÁC ĐỊNH";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ChoXacNhan": return "fa-clock";
      case "DangChuanBi": return "fa-utensils";
      case "SanSangGiao": return "fa-check-circle";
      case "DangGiao": return "fa-truck";
      case "DaGiao": return "fa-check-double";
      case "Huy": return "fa-times-circle";
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
              { id: "ChoXacNhan", icon: "fa-clock", label: "Đang chờ" },
              { id: "DangChuanBi", icon: "fa-utensils", label: "Đang nấu" },
              { id: "SanSangGiao", icon: "fa-check-circle", label: "Sẵn sàng" },
              { id: "DangGiao", icon: "fa-truck", label: "Đang giao" },
              { id: "DaGiao", icon: "fa-check-double", label: "Đã giao" },
              { id: "Huy", icon: "fa-times-circle", label: "Đã hủy" }
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
            {loading ? (
              <p style={{ textAlign: "center", padding: "50px" }}>Đang tải đơn hàng...</p>
            ) : ordersData.length === 0 ? (
              <div className="empty-orders">
                <i className="fa-solid fa-folder-open"></i>
                <h3>Chưa có đơn hàng nào</h3>
                <p>Bạn chưa có đơn hàng nào trong trạng thái này.</p>
              </div>
            ) : (
              ordersData.map(order => (
                <div className="customer-order-card" key={order.maDonHang}>
                  <div className="order-card-header">
                    <div className="order-id-section">
                      <h4><i className="fa-solid fa-receipt"></i> Đơn hàng #{order.maDonHang}</h4>
                      <span className="order-date">{new Date(order.ngayDat).toLocaleString()}</span>
                    </div>
                    <div className={`order-status-badge status-${order.trangThai?.toLowerCase()}`}>
                      <i className={`fa-solid ${getStatusIcon(order.trangThai)}`}></i> {getStatusText(order.trangThai)}
                    </div>
                  </div>
                  
                  <div className="order-card-body">
                    <div className="order-info-row">
                      <i className="fa-solid fa-store"></i>
                      <span>Nhà hàng: <strong>{order.tenNhaHang}</strong></span>
                    </div>
                    <div className="order-info-row">
                      <i className="fa-solid fa-location-dot"></i>
                      <span>Địa chỉ giao: {order.diaChiGiao}</span>
                    </div>
                    <div className="order-info-row">
                      <i className="fa-solid fa-money-bill-wave"></i>
                      <span className="order-total">Tổng tiền: {order.tongTien?.toLocaleString("vi-VN")} VNĐ</span>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    <button className="btn-view-detail" onClick={() => openDetail(order)}>
                      <i className="fa-solid fa-eye"></i> Xem chi tiết
                    </button>
                    {order.trangThai === "ChoXacNhan" && (
                      <button className="btn-cancel-order" style={{ marginLeft: "10px" }} onClick={() => handleCancelOrder(order.maDonHang)}>
                        <i className="fa-solid fa-xmark"></i> Hủy đơn
                      </button>
                    )}
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
              <div className="detail-section">
                <h4><i className="fa-solid fa-circle-info"></i> Thông tin đơn hàng</h4>
                <div className="detail-row">
                  <span className="detail-label">Mã đơn hàng:</span>
                  <span className="detail-value">#{selectedOrder.maDonHang}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Trạng thái:</span>
                  <span className={`order-status-badge status-${selectedOrder.trangThai?.toLowerCase()}`}>
                    <i className={`fa-solid ${getStatusIcon(selectedOrder.trangThai)}`}></i> {getStatusText(selectedOrder.trangThai)}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Nhà hàng:</span>
                  <span className="detail-value">{selectedOrder.tenNhaHang}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Thời gian đặt:</span>
                  <span className="detail-value">{new Date(selectedOrder.ngayDat).toLocaleString()}</span>
                </div>
              </div>

              <div className="detail-section">
                <h4><i className="fa-solid fa-user"></i> Thông tin giao hàng</h4>
                <div className="detail-row">
                  <span className="detail-label">Địa chỉ nhận:</span>
                  <span className="detail-value">{selectedOrder.diaChiGiao}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Phương thức:</span>
                  <span className="detail-value">{selectedOrder.phuongThucThanhToan}</span>
                </div>
              </div>

              <div className="detail-section payment-section">
                <h4><i className="fa-solid fa-credit-card"></i> Thanh toán</h4>
                <div className="detail-row">
                  <span className="detail-label">Tổng tiền:</span>
                  <span className="total-bold">{selectedOrder.tongTien?.toLocaleString("vi-VN")} VNĐ</span>
                </div>
              </div>

              <div className="modal-footer-actions" style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                {selectedOrder.trangThai === "ChoXacNhan" && (
                  <button className="btn-cancel-order" onClick={() => handleCancelOrder(selectedOrder.maDonHang)}>
                    <i className="fa-solid fa-xmark"></i> Hủy đơn hàng này
                  </button>
                )}
                <button className="btn-view-detail" style={{ marginLeft: "10px" }} onClick={() => setIsModalOpen(false)}>
                  Đóng
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
