import React from 'react';

interface CustomerOrderCardProps {
  order: any;
  onViewDetail: (order: any) => void;
  onCancelOrder: (orderId: number) => void;
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    ChoXacNhan: 'ĐANG CHỜ',
    DaXacNhan: 'ĐÃ XÁC NHẬN',
    DangChuanBi: 'ĐANG CHUẨN BỊ',
    SanSangGiao: 'SẴN SÀNG',
    DangGiao: 'ĐANG GIAO',
    DaGiao: 'HOÀN THÀNH',
    Huy: 'ĐÃ HỦY',
  };
  return map[status] || status?.toUpperCase() || 'KHÔNG XÁC ĐỊNH';
};

const getStatusIcon = (status: string) => {
  const map: Record<string, string> = {
    ChoXacNhan: 'fa-clock',
    DaXacNhan: 'fa-check',
    DangChuanBi: 'fa-utensils',
    SanSangGiao: 'fa-check-circle',
    DangGiao: 'fa-truck',
    DaGiao: 'fa-check-double',
    Huy: 'fa-times-circle',
  };
  return map[status] || 'fa-info-circle';
};

const CustomerOrderCard: React.FC<CustomerOrderCardProps> = ({ order, onViewDetail, onCancelOrder }) => {
  return (
    <div className="customer-order-card" key={order.MaDonHang}>
      <div className="order-card-header">
        <div className="order-id-section">
          <h4><i className="fa-solid fa-receipt"></i> Đơn hàng #{order.MaDonHang}</h4>
          <span className="order-date">{new Date(order.NgayDat).toLocaleString()}</span>
        </div>
        <div className={`order-status-badge status-${order.TrangThai?.toLowerCase()}`}>
          <i className={`fa-solid ${getStatusIcon(order.TrangThai)}`}></i> {getStatusText(order.TrangThai)}
        </div>
      </div>

      <div className="order-card-body">
        <div className="order-info-row">
          <i className="fa-solid fa-store"></i>
          <span>Nhà hàng: <strong>{order.TenNhaHang || 'DA Food'}</strong></span>
        </div>
        <div className="order-info-row">
          <i className="fa-solid fa-location-dot"></i>
          <span>Địa chỉ giao: {order.DiaChiGiao}</span>
        </div>
        <div className="order-info-row">
          <i className="fa-solid fa-money-bill-wave"></i>
          <span className="order-total">Tổng tiền: {Number(order.TongTien).toLocaleString('vi-VN')} VNĐ</span>
        </div>
        {order.TenShipper && (
          <div className="order-info-row">
            <i className="fa-solid fa-truck"></i>
            <span>Shipper: <strong>{order.TenShipper}</strong> - {order.ShipperSDT}</span>
          </div>
        )}
      </div>

      <div className="order-card-footer">
        <button className="btn-view-detail" onClick={() => onViewDetail(order)}>
          <i className="fa-solid fa-eye"></i> Xem chi tiết
        </button>
        {order.TrangThai === 'ChoXacNhan' && (
          <button className="btn-cancel-order" style={{ marginLeft: '10px' }} onClick={() => onCancelOrder(order.MaDonHang)}>
            <i className="fa-solid fa-xmark"></i> Hủy đơn
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerOrderCard;
