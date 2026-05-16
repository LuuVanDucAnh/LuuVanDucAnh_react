import React from 'react';

interface OrderDetailModalProps {
  order: any;
  orderDetail: any;
  loadingDetail: boolean;
  onClose: () => void;
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

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, orderDetail, loadingDetail, onClose, onCancelOrder }) => {
  if (!order) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content order-detail-modal" onClick={e => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>&times;</span>

        <h2><i className="fa-solid fa-receipt"></i> Chi tiết đơn hàng #{order.MaDonHang}</h2>

        {loadingDetail ? (
          <p>Đang tải chi tiết...</p>
        ) : orderDetail ? (
          <div className="order-detail-content">
            <div className="detail-section">
              <h4><i className="fa-solid fa-circle-info"></i> Thông tin đơn hàng</h4>
              <div className="detail-row">
                <span className="detail-label">Mã đơn hàng:</span>
                <span className="detail-value">#{orderDetail.MaDonHang}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Trạng thái:</span>
                <span className={`order-status-badge status-${orderDetail.TrangThai?.toLowerCase()}`}>
                  <i className={`fa-solid ${getStatusIcon(orderDetail.TrangThai)}`}></i> {getStatusText(orderDetail.TrangThai)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Nhà hàng:</span>
                <span className="detail-value">{orderDetail.TenNhaHang || 'DA Food'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Thời gian đặt:</span>
                <span className="detail-value">{new Date(orderDetail.NgayDat).toLocaleString()}</span>
              </div>
              {orderDetail.NgayGiao && (
                <div className="detail-row">
                  <span className="detail-label">Thời gian giao:</span>
                  <span className="detail-value">{new Date(orderDetail.NgayGiao).toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h4><i className="fa-solid fa-utensils"></i> Món ăn</h4>
              {orderDetail.items?.map((item: any, idx: number) => (
                <div key={idx} className="detail-row">
                  <span>{item.SoLuong} x {item.TenMon}</span>
                  <span>{Number(item.DonGia * item.SoLuong).toLocaleString('vi-VN')}đ</span>
                </div>
              ))}
            </div>

            <div className="detail-section">
              <h4><i className="fa-solid fa-user"></i> Thông tin giao hàng</h4>
              <div className="detail-row">
                <span className="detail-label">Địa chỉ nhận:</span>
                <span className="detail-value">{orderDetail.DiaChiGiao}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phương thức:</span>
                <span className="detail-value">{orderDetail.PhuongThucThanhToan}</span>
              </div>
              {orderDetail.GhiChu && (
                <div className="detail-row">
                  <span className="detail-label">Ghi chú:</span>
                  <span className="detail-value">{orderDetail.GhiChu}</span>
                </div>
              )}
            </div>

            <div className="detail-section payment-section">
              <h4><i className="fa-solid fa-credit-card"></i> Thanh toán</h4>
              <div className="detail-row">
                <span className="detail-label">Tạm tính:</span>
                <span className="detail-value">{Number(orderDetail.TongTien - orderDetail.PhiShip).toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phí ship:</span>
                <span className="detail-value">{Number(orderDetail.PhiShip).toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Tổng tiền:</span>
                <span className="total-bold">{Number(orderDetail.TongTien).toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Thanh toán:</span>
                <span className="detail-value">{orderDetail.TrangThaiThanhToan === 'DaThanhToan' ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
              </div>
            </div>

            <div className="modal-footer-actions" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              {order.TrangThai === 'ChoXacNhan' && (
                <button className="btn-cancel-order" onClick={() => onCancelOrder(order.MaDonHang)}>
                  <i className="fa-solid fa-xmark"></i> Hủy đơn hàng này
                </button>
              )}
              <button className="btn-view-detail" style={{ marginLeft: '10px' }} onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default OrderDetailModal;
