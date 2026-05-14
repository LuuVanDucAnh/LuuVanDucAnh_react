import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { shippingService } from "../services/apiService";
import "../assets/css/style_shipper.css";

const ShipperAdmin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"dashboard" | "pending" | "my-orders" | "completed" | "statistics">("dashboard");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Data state
  const [pendingOrders, setPendingOrders] = useState<any[]>([]);
  const [myTasks, setMyTasks] = useState<any[]>([]);
  const [shipperProfile, setShipperProfile] = useState<any>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loadingPending, setLoadingPending] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) setCurrentUser(JSON.parse(userStr));
    fetchAll();
  }, []);

  const fetchAll = async () => {
    await Promise.all([fetchPendingOrders(), fetchMyTasks(), fetchProfile()]);
  };

  const fetchPendingOrders = async () => {
    setLoadingPending(true);
    try {
      const res = await shippingService.getPendingOrders({ limit: 50 });
      setPendingOrders(res.orders || []);
    } catch (error) {
      console.error("Lỗi khi tải đơn chờ:", error);
    } finally {
      setLoadingPending(false);
    }
  };

  const fetchMyTasks = async () => {
    try {
      const res = await shippingService.getMyTasks();
      setMyTasks(res.orders || []);
    } catch (error) {
      console.error("Lỗi khi tải đơn của tôi:", error);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await shippingService.getProfile();
      setShipperProfile(res.shipper || null);
    } catch (error) {
      console.error("Lỗi khi tải profile:", error);
    }
  };

  const handleReceiveOrder = async (orderId: number) => {
    if (!window.confirm("Bạn muốn nhận đơn hàng này?")) return;
    setLoading(true);
    try {
      await shippingService.receiveOrder(orderId);
      alert("Đã nhận đơn thành công!");
      fetchAll();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi nhận đơn!");
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId: number) => {
    if (!window.confirm("Xác nhận đã giao hàng thành công?")) return;
    setLoading(true);
    try {
      await shippingService.completeOrder(orderId);
      alert("Chúc mừng bạn đã hoàn thành đơn hàng!");
      fetchAll();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelivery = async (orderId: number) => {
    const lyDo = window.prompt("Lý do hủy nhận đơn:");
    if (lyDo === null) return;
    setLoading(true);
    try {
      await shippingService.cancelDelivery(orderId, lyDo);
      alert("Đã hủy nhận đơn. Đơn sẽ được giao cho shipper khác.");
      fetchAll();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi hủy đơn!");
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = myTasks.filter(o => o.TrangThai !== 'DaGiao' && o.TrangThai !== 'Huy');
  const completedOrders = myTasks.filter(o => o.TrangThai === 'DaGiao');

  const stats = {
    pending: pendingOrders.length,
    inProgress: activeOrders.length,
    completed: completedOrders.length,
    totalEarnings: completedOrders.reduce((sum, o) => sum + Number(o.PhiShip || 15000), 0),
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      ChoXacNhan: 'Chờ xác nhận',
      DaXacNhan: 'Đã xác nhận',
      DangChuanBi: 'Đang chuẩn bị',
      SanSangGiao: 'Sẵn sàng giao',
      DangGiao: 'Đang giao',
      DaGiao: 'Đã giao',
      Huy: 'Đã hủy',
    };
    return map[status] || status;
  };

  const renderOrderCard = (order: any, showActions = true) => (
    <div key={order.MaDonHang} className="shipper-order-card" onClick={() => setSelectedOrder(order)}>
      <div className="shipper-order-header">
        <span className="shipper-order-id">Đơn hàng #{order.MaDonHang}</span>
        <span className={`shipper-order-status ${order.TrangThai?.toLowerCase()}`}>
          {getStatusLabel(order.TrangThai)}
        </span>
      </div>
      <div className="shipper-order-info">
        <div className="shipper-info-item">
          <i className="fa-solid fa-user"></i>
          <span><strong>Khách:</strong> {order.TenKhachHang || order.MaKhachHang}</span>
        </div>
        <div className="shipper-info-item">
          <i className="fa-solid fa-phone"></i>
          <span>{order.KhachHangSDT || '-'}</span>
        </div>
        <div className="shipper-info-item">
          <i className="fa-solid fa-location-dot"></i>
          <span><strong>Địa chỉ:</strong> {order.DiaChiGiao}</span>
        </div>
        <div className="shipper-info-item">
          <i className="fa-solid fa-clock"></i>
          <span>Ngày đặt: {new Date(order.NgayDat).toLocaleString()}</span>
        </div>
        {order.GhiChu && (
          <div className="shipper-info-item">
            <i className="fa-solid fa-sticky-note"></i>
            <span>Ghi chú: {order.GhiChu}</span>
          </div>
        )}
      </div>
      <div className="shipper-order-total">
        Tổng tiền: {Number(order.TongTien).toLocaleString()} VNĐ | Phí ship: {Number(order.PhiShip || 15000).toLocaleString()} VNĐ
      </div>
      {showActions && (
        <div className="shipper-order-actions">
          {order.TrangThai === 'SanSangGiao' && (
            <button
              className="shipper-btn-action shipper-btn-accept"
              onClick={(e) => { e.stopPropagation(); handleReceiveOrder(order.MaDonHang); }}
              disabled={loading}
            >
              <i className="fa-solid fa-hand-holding-heart"></i> Nhận đơn
            </button>
          )}
          {order.TrangThai === 'DangGiao' && (
            <>
              <button
                className="shipper-btn-action shipper-btn-complete"
                onClick={(e) => { e.stopPropagation(); handleCompleteOrder(order.MaDonHang); }}
                disabled={loading}
              >
                <i className="fa-solid fa-check-circle"></i> Hoàn thành
              </button>
              <button
                className="shipper-btn-action shipper-btn-detail"
                onClick={(e) => { e.stopPropagation(); handleCancelDelivery(order.MaDonHang); }}
                disabled={loading}
              >
                <i className="fa-solid fa-arrow-rotate-left"></i> Trả đơn
              </button>
            </>
          )}
          <button
            className="shipper-btn-action shipper-btn-detail"
            onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
          >
            <i className="fa-solid fa-eye"></i> Chi tiết
          </button>
        </div>
      )}
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
              <i className="fa-solid fa-motorcycle"></i> <span>Đơn của tôi</span>
              {stats.inProgress > 0 && <span className="shipper-badge">{stats.inProgress}</span>}
            </div>
            <div className={`shipper-menu-item ${activeTab === "completed" ? "active" : ""}`} onClick={() => setActiveTab("completed")}>
              <i className="fa-solid fa-check-circle"></i> <span>Đã giao</span>
            </div>
          </nav>
        </div>

        <div className="shipper-content">
          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <section id="dashboard">
              <div className="shipper-welcome">
                <h3>Chào mừng, {shipperProfile?.HoTen || currentUser?.hoTen || currentUser?.username}!</h3>
                <p>Quản lý đơn hàng giao của bạn một cách hiệu quả</p>
              </div>
              <div className="shipper-stats">
                <div className="shipper-card" onClick={() => setActiveTab("pending")} style={{ cursor: 'pointer' }}>
                  <i className="fa-solid fa-clock"></i>
                  <span>{stats.pending}</span> <p>Đơn hàng chờ</p>
                </div>
                <div className="shipper-card" onClick={() => setActiveTab("my-orders")} style={{ cursor: 'pointer' }}>
                  <i className="fa-solid fa-motorcycle"></i>
                  <span>{stats.inProgress}</span> <p>Đang giao</p>
                </div>
                <div className="shipper-card" onClick={() => setActiveTab("completed")} style={{ cursor: 'pointer' }}>
                  <i className="fa-solid fa-check-circle"></i>
                  <span>{stats.completed}</span> <p>Đã giao</p>
                </div>
                <div className="shipper-card">
                  <i className="fa-solid fa-money-bill-wave"></i>
                  <span>{stats.totalEarnings.toLocaleString()}đ</span> <p>Tổng phí ship</p>
                </div>
              </div>
              {shipperProfile && (
                <div className="shipper-profile-card" style={{ marginTop: '20px', background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <h4><i className="fa-solid fa-id-card"></i> Thông tin cá nhân</h4>
                  <p><strong>Họ tên:</strong> {shipperProfile.HoTen}</p>
                  <p><strong>Biển số xe:</strong> {shipperProfile.BienSoXe}</p>
                  <p><strong>SĐT:</strong> {shipperProfile.SoDienThoai}</p>
                  <p><strong>Tổng đơn đã giao:</strong> {shipperProfile.SoDonDaGiao}</p>
                </div>
              )}
            </section>
          )}

          {/* PENDING ORDERS */}
          {activeTab === "pending" && (
            <section id="pending-orders">
              <div className="shipper-section-header">
                <h3><i className="fa-solid fa-clock"></i> Đơn hàng chờ nhận</h3>
                <button className="shipper-btn-refresh" onClick={fetchPendingOrders} disabled={loadingPending}>
                  <i className="fa-solid fa-refresh"></i> Làm mới
                </button>
              </div>
              <div className="shipper-orders-list">
                {loadingPending ? (
                  <p className="shipper-empty-state">Đang tải...</p>
                ) : pendingOrders.length === 0 ? (
                  <p className="shipper-empty-state">
                    <i className="fa-solid fa-check-circle" style={{ fontSize: '40px' }}></i>
                    Không có đơn hàng chờ nào!
                  </p>
                ) : (
                  pendingOrders.map(order => renderOrderCard(order))
                )}
              </div>
            </section>
          )}

          {/* MY ORDERS */}
          {activeTab === "my-orders" && (
            <section id="my-orders">
              <div className="shipper-section-header">
                <h3><i className="fa-solid fa-motorcycle"></i> Đơn hàng của tôi</h3>
                <button className="shipper-btn-refresh" onClick={fetchMyTasks} disabled={loading}>
                  <i className="fa-solid fa-refresh"></i> Làm mới
                </button>
              </div>
              <div className="shipper-orders-list">
                {activeOrders.length === 0 ? (
                  <p className="shipper-empty-state">
                    <i className="fa-solid fa-box-open" style={{ fontSize: '40px' }}></i>
                    Không có đơn nào đang giao
                  </p>
                ) : (
                  activeOrders.map(order => renderOrderCard(order))
                )}
              </div>
            </section>
          )}

          {/* COMPLETED */}
          {activeTab === "completed" && (
            <section id="completed-orders">
              <div className="shipper-section-header">
                <h3><i className="fa-solid fa-check-circle"></i> Lịch sử đã giao</h3>
                <button className="shipper-btn-refresh" onClick={fetchMyTasks} disabled={loading}>
                  <i className="fa-solid fa-refresh"></i> Làm mới
                </button>
              </div>
              <div className="shipper-orders-list">
                {completedOrders.length === 0 ? (
                  <p className="shipper-empty-state">
                    <i className="fa-solid fa-receipt" style={{ fontSize: '40px' }}></i>
                    Chưa có đơn hoàn thành nào
                  </p>
                ) : (
                  completedOrders.map(order => renderOrderCard(order, false))
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="shipper-modal" onClick={() => setSelectedOrder(null)}>
          <div className="shipper-modal-content" onClick={e => e.stopPropagation()}>
            <span className="shipper-close-modal" onClick={() => setSelectedOrder(null)}>&times;</span>
            <h3><i className="fa-solid fa-receipt"></i> Chi tiết đơn #{selectedOrder.MaDonHang}</h3>
            <div className="shipper-modal-body">
              <div className="detail-section">
                <h4><i className="fa-solid fa-user"></i> Khách hàng</h4>
                <div className="detail-row"><span className="detail-label">Tên:</span><span className="detail-value">{selectedOrder.TenKhachHang || selectedOrder.MaKhachHang}</span></div>
                <div className="detail-row"><span className="detail-label">SĐT:</span><span className="detail-value">{selectedOrder.KhachHangSDT || '-'}</span></div>
                <div className="detail-row"><span className="detail-label">Địa chỉ:</span><span className="detail-value">{selectedOrder.DiaChiGiao}</span></div>
              </div>
              {selectedOrder.TenNhaHang && (
                <div className="detail-section">
                  <h4><i className="fa-solid fa-store"></i> Nhà hàng</h4>
                  <div className="detail-row"><span className="detail-label">Tên:</span><span className="detail-value">{selectedOrder.TenNhaHang}</span></div>
                  <div className="detail-row"><span className="detail-label">Địa chỉ:</span><span className="detail-value">{selectedOrder.DiaChiNhaHang || '-'}</span></div>
                </div>
              )}
              <div className="detail-section">
                <h4><i className="fa-solid fa-circle-info"></i> Đơn hàng</h4>
                <div className="detail-row"><span className="detail-label">Trạng thái:</span>
                  <span className={`shipper-order-status ${selectedOrder.TrangThai?.toLowerCase()}`}>
                    {getStatusLabel(selectedOrder.TrangThai)}
                  </span>
                </div>
                <div className="detail-row"><span className="detail-label">Ngày đặt:</span><span className="detail-value">{new Date(selectedOrder.NgayDat).toLocaleString()}</span></div>
                <div className="detail-row"><span className="detail-label">Ngày giao:</span><span className="detail-value">{selectedOrder.NgayGiao ? new Date(selectedOrder.NgayGiao).toLocaleString() : '-'}</span></div>
                {selectedOrder.GhiChu && (
                  <div className="detail-row"><span className="detail-label">Ghi chú:</span><span className="detail-value">{selectedOrder.GhiChu}</span></div>
                )}
              </div>
              <div className="detail-section">
                <h4><i className="fa-solid fa-credit-card"></i> Thanh toán</h4>
                <div className="detail-row"><span className="detail-label">Phương thức:</span><span className="detail-value">{selectedOrder.PhuongThucThanhToan}</span></div>
                <div className="detail-row"><span className="detail-label">Tổng tiền:</span><span className="detail-value" style={{ color: 'var(--orange)', fontWeight: 'bold' }}>{Number(selectedOrder.TongTien).toLocaleString()} VNĐ</span></div>
                <div className="detail-row"><span className="detail-label">Phí ship:</span><span className="detail-value">{Number(selectedOrder.PhiShip || 15000).toLocaleString()} VNĐ</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ShipperAdmin;
