import React from 'react';

interface ShipperOrderCardProps {
  order: any;
  onReceive: (orderId: number) => void;
  onStartDelivery: (orderId: number) => void;
  onComplete: (orderId: number) => void;
  onCancel: (orderId: number) => void;
  onViewDetail: (order: any) => void;
  loading: boolean;
  showActions?: boolean;
}

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

const ShipperOrderCard: React.FC<ShipperOrderCardProps> = ({
  order,
  onReceive,
  onStartDelivery,
  onComplete,
  onCancel,
  onViewDetail,
  loading,
  showActions = true,
}) => {
  return (
    <div className="shipper-order-card" onClick={() => onViewDetail(order)}>
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
          {order.TrangThai === 'DangGiao' && (
            <button
              className="shipper-btn-action shipper-btn-start"
              onClick={(e) => { e.stopPropagation(); onStartDelivery(order.MaDonHang); }}
              disabled={loading}
            >
              <i className="fa-solid fa-truck-fast"></i> Bắt đầu giao
            </button>
          )}
          {order.TrangThai === 'SanSangGiao' && (
            <button
              className="shipper-btn-action shipper-btn-accept"
              onClick={(e) => { e.stopPropagation(); onReceive(order.MaDonHang); }}
              disabled={loading}
            >
              <i className="fa-solid fa-hand-holding-heart"></i> Nhận đơn
            </button>
          )}
          {order.TrangThai === 'DangGiao' && (
            <>
              <button
                className="shipper-btn-action shipper-btn-complete"
                onClick={(e) => { e.stopPropagation(); onComplete(order.MaDonHang); }}
                disabled={loading}
              >
                <i className="fa-solid fa-check-circle"></i> Hoàn thành
              </button>
              <button
                className="shipper-btn-action shipper-btn-detail"
                onClick={(e) => { e.stopPropagation(); onCancel(order.MaDonHang); }}
                disabled={loading}
              >
                <i className="fa-solid fa-arrow-rotate-left"></i> Trả đơn
              </button>
            </>
          )}
          <button
            className="shipper-btn-action shipper-btn-detail"
            onClick={(e) => { e.stopPropagation(); onViewDetail(order); }}
          >
            <i className="fa-solid fa-eye"></i> Chi tiết
          </button>
        </div>
      )}
    </div>
  );
};

export default ShipperOrderCard;
