import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ordersService } from '../services/apiService';
import '../assets/css/style_my_orders.css';

export default function MyOrders() {
  const [filter, setFilter] = useState('all');
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderDetail, setOrderDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetchMyOrders();
  }, [filter]);

  const fetchMyOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersService.getMyOrders();
      let orders = res.orders || [];
      if (filter !== 'all') {
        orders = orders.filter((o: any) => o.TrangThai === filter);
      }
      setOrdersData(orders);
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (id: number) => {
    setLoadingDetail(true);
    try {
      const res = await ordersService.getOrderById(id);
      setOrderDetail(res.order);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết:', error);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      try {
        await ordersService.cancel(orderId);
        alert('Hủy đơn hàng thành công!');
        fetchMyOrders();
        setSelectedOrder(null);
      } catch (error: any) {
        alert(error.response?.data?.message || 'Lỗi khi hủy đơn hàng');
      }
    }
  };

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

  const openDetail = (order: any) => {
    setSelectedOrder(order);
    fetchOrderDetail(order.MaDonHang);
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
              { id: 'all', icon: 'fa-list', label: 'Tất cả' },
              { id: 'ChoXacNhan', icon: 'fa-clock', label: 'Đang chờ' },
              { id: 'DangChuanBi', icon: 'fa-utensils', label: 'Đang nấu' },
              { id: 'SanSangGiao', icon: 'fa-check-circle', label: 'Sẵn sàng' },
              { id: 'DangGiao', icon: 'fa-truck', label: 'Đang giao' },
              { id: 'DaGiao', icon: 'fa-check-double', label: 'Đã giao' },
              { id: 'Huy', icon: 'fa-times-circle', label: 'Đã hủy' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`filter-tab ${filter === tab.id ? 'active' : ''}`}
                onClick={() => setFilter(tab.id)}
              >
                <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
              </button>
            ))}
          </div>

          <div className="orders-list-container">
            {loading ? (
              <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải đơn hàng...</p>
            ) : ordersData.length === 0 ? (
              <div className="empty-orders">
                <i className="fa-solid fa-folder-open"></i>
                <h3>Chưa có đơn hàng nào</h3>
                <p>Bạn chưa có đơn hàng nào trong trạng thái này.</p>
              </div>
            ) : (
              ordersData.map(order => (
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
                    <button className="btn-view-detail" onClick={() => openDetail(order)}>
                      <i className="fa-solid fa-eye"></i> Xem chi tiết
                    </button>
                    {order.TrangThai === 'ChoXacNhan' && (
                      <button className="btn-cancel-order" style={{ marginLeft: '10px' }} onClick={() => handleCancelOrder(order.MaDonHang)}>
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content order-detail-modal" onClick={e => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setSelectedOrder(null)}>&times;</span>

            <h2><i className="fa-solid fa-receipt"></i> Chi tiết đơn hàng #{selectedOrder.MaDonHang}</h2>

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
                  {selectedOrder.TrangThai === 'ChoXacNhan' && (
                    <button className="btn-cancel-order" onClick={() => handleCancelOrder(selectedOrder.MaDonHang)}>
                      <i className="fa-solid fa-xmark"></i> Hủy đơn hàng này
                    </button>
                  )}
                  <button className="btn-view-detail" style={{ marginLeft: '10px' }} onClick={() => setSelectedOrder(null)}>
                    Đóng
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
