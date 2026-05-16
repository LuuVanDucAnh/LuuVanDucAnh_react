import React from 'react';

interface ShipperOrderModalProps {
  order: any;
  onClose: () => void;
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

const ShipperOrderModal: React.FC<ShipperOrderModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="shipper-modal" onClick={onClose}>
      <div className="shipper-modal-content" onClick={e => e.stopPropagation()}>
        <span className="shipper-close-modal" onClick={onClose}>&times;</span>
        <h3><i className="fa-solid fa-receipt"></i> Chi tiết đơn #{order.MaDonHang}</h3>
        <div className="shipper-modal-body">
          <div className="detail-section">
            <h4><i className="fa-solid fa-user"></i> Khách hàng</h4>
            <div className="detail-row"><span className="detail-label">Tên:</span><span className="detail-value">{order.TenKhachHang || order.MaKhachHang}</span></div>
            <div className="detail-row"><span className="detail-label">SĐT:</span><span className="detail-value">{order.KhachHangSDT || '-'}</span></div>
            <div className="detail-row"><span className="detail-label">Địa chỉ:</span><span className="detail-value">{order.DiaChiGiao}</span></div>
          </div>
          {order.TenNhaHang && (
            <div className="detail-section">
              <h4><i className="fa-solid fa-store"></i> Nhà hàng</h4>
              <div className="detail-row"><span className="detail-label">Tên:</span><span className="detail-value">{order.TenNhaHang}</span></div>
              <div className="detail-row"><span className="detail-label">Địa chỉ:</span><span className="detail-value">{order.DiaChiNhaHang || '-'}</span></div>
            </div>
          )}
          <div className="detail-section">
            <h4><i className="fa-solid fa-circle-info"></i> Đơn hàng</h4>
            <div className="detail-row"><span className="detail-label">Trạng thái:</span>
              <span className={`shipper-order-status ${order.TrangThai?.toLowerCase()}`}>
                {getStatusLabel(order.TrangThai)}
              </span>
            </div>
            <div className="detail-row"><span className="detail-label">Ngày đặt:</span><span className="detail-value">{new Date(order.NgayDat).toLocaleString()}</span></div>
            <div className="detail-row"><span className="detail-label">Ngày giao:</span><span className="detail-value">{order.NgayGiao ? new Date(order.NgayGiao).toLocaleString() : '-'}</span></div>
            {order.GhiChu && (
              <div className="detail-row"><span className="detail-label">Ghi chú:</span><span className="detail-value">{order.GhiChu}</span></div>
            )}
          </div>
          <div className="detail-section">
            <h4><i className="fa-solid fa-credit-card"></i> Thanh toán</h4>
            <div className="detail-row"><span className="detail-label">Phương thức:</span><span className="detail-value">{order.PhuongThucThanhToan}</span></div>
            <div className="detail-row"><span className="detail-label">Tổng tiền:</span><span className="detail-value" style={{ color: 'var(--orange)', fontWeight: 'bold' }}>{Number(order.TongTien).toLocaleString()} VNĐ</span></div>
            <div className="detail-row"><span className="detail-label">Phí ship:</span><span className="detail-value">{Number(order.PhiShip || 15000).toLocaleString()} VNĐ</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipperOrderModal;
