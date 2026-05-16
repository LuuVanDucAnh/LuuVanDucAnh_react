import React from 'react';

interface ShipperDashboardProps {
  shipperProfile: any;
  currentUser: any;
  stats: {
    pending: number;
    inProgress: number;
    completed: number;
    totalEarnings: number;
  };
  onTabChange: (tab: "dashboard" | "pending" | "my-orders" | "completed" | "statistics") => void;
}

const ShipperDashboard: React.FC<ShipperDashboardProps> = ({ shipperProfile, currentUser, stats, onTabChange }) => {
  return (
    <section id="dashboard">
      <div className="shipper-welcome">
        <h3>Chào mừng, {shipperProfile?.HoTen || currentUser?.hoTen || currentUser?.username}!</h3>
        <p>Quản lý đơn hàng giao của bạn một cách hiệu quả</p>
      </div>
      <div className="shipper-stats">
        <div className="shipper-card" onClick={() => onTabChange("pending")} style={{ cursor: 'pointer' }}>
          <i className="fa-solid fa-clock"></i>
          <span>{stats.pending}</span> <p>Đơn hàng chờ</p>
        </div>
        <div className="shipper-card" onClick={() => onTabChange("my-orders")} style={{ cursor: 'pointer' }}>
          <i className="fa-solid fa-motorcycle"></i>
          <span>{stats.inProgress}</span> <p>Đang giao</p>
        </div>
        <div className="shipper-card" onClick={() => onTabChange("completed")} style={{ cursor: 'pointer' }}>
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
  );
};

export default ShipperDashboard;
