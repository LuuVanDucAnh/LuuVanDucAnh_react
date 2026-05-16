import React from 'react';

interface RestaurantOrderCardProps {
  order: any;
  onConfirm: (orderId: number) => void;
  onReady: (orderId: number) => void;
  onReject: (orderId: number) => void;
}

const getStatusLabel = (status: string) => {
  const map: Record<string, string> = {
    ChoXacNhan: 'Chờ xác nhận',
    DaXacNhan: 'Đã xác nhận',
    DangChuanBi: 'Đang chuẩn bị',
    SanSangGiao: 'Sẵn sàng',
    DangGiao: 'Đang giao',
    DaGiao: 'Đã giao',
    Huy: 'Đã hủy',
  };
  return map[status] || status;
};

const RestaurantOrderCard: React.FC<RestaurantOrderCardProps> = ({ order, onConfirm, onReady, onReject }) => {
  return (
    <div className="restaurant-order-card" key={order.MaDonHang}>
      <div className="order-header">
        <strong><i className="fa-solid fa-receipt"></i> #{order.MaDonHang}</strong>
        <span className={`order-status status-${order.TrangThai?.toLowerCase()}`}>
          {getStatusLabel(order.TrangThai)}
        </span>
      </div>
      <div className="order-info">
        <div className="info-row">
          <i className="fa-solid fa-user"></i>
          <span>{order.TenKhachHang || order.MaKhachHang} - {order.KhachHangSDT || ''}</span>
        </div>
        <div className="info-row">
          <i className="fa-solid fa-location-dot"></i>
          <span>Địa chỉ: {order.DiaChiGiao}</span>
        </div>
        <div className="info-row">
          <i className="fa-solid fa-clock"></i>
          <span>Ngày đặt: {new Date(order.NgayDat).toLocaleString()}</span>
        </div>
        {order.GhiChu && (
          <div className="info-row">
            <i className="fa-solid fa-sticky-note"></i>
            <span>Ghi chú: {order.GhiChu}</span>
          </div>
        )}
      </div>
      <div className="order-footer">
        <div className="order-total">
          Tổng cộng: <span>{Number(order.TongTien).toLocaleString("vi-VN")} VNĐ</span>
        </div>
        <div className="order-actions">
          {order.TrangThai === 'ChoXacNhan' && (
            <>
              <button className="btn-action btn-confirm" onClick={() => onConfirm(order.MaDonHang)}>
                <i className="fa-solid fa-check"></i> Xác nhận & Chuẩn bị
              </button>
              <button className="btn-action btn-danger" onClick={() => onReject(order.MaDonHang)}>
                <i className="fa-solid fa-xmark"></i> Từ chối
              </button>
            </>
          )}
          {order.TrangThai === 'DangChuanBi' && (
            <button className="btn-action btn-ready" onClick={() => onReady(order.MaDonHang)}>
              <i className="fa-solid fa-bell"></i> Sẵn sàng giao
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantOrderCard;
