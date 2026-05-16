import React from 'react';
import RestaurantOrderCard from './RestaurantOrderCard';

interface OrderManagerProps {
  orders: any[];
  ordersLoading: boolean;
  orderFilter: string;
  onFilterChange: (filter: string) => void;
  onConfirmOrder: (orderId: number) => void;
  onReadyOrder: (orderId: number) => void;
  onRejectOrder: (orderId: number) => void;
}

const OrderManager: React.FC<OrderManagerProps> = ({
  orders,
  ordersLoading,
  orderFilter,
  onFilterChange,
  onConfirmOrder,
  onReadyOrder,
  onRejectOrder,
}) => {
  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "ChoXacNhan", label: "Chờ xác nhận" },
    { id: "DangChuanBi", label: "Đang chuẩn bị" },
    { id: "SanSangGiao", label: "Sẵn sàng" },
    { id: "DangGiao", label: "Đang giao" },
    { id: "DaGiao", label: "Đã giao" },
    { id: "Huy", label: "Đã hủy" },
  ];

  return (
    <div className="order-manager">
      <h2><i className="fa-solid fa-clipboard-list"></i> Quản lý đơn hàng</h2>
      <div className="order-filters">
        {filters.map(f => (
          <button
            key={f.id}
            className={`filter-btn ${orderFilter === f.id ? "active" : ""}`}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div id="orders-list" className="orders-list">
        {ordersLoading ? (
          <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>Đang tải...</p>
        ) : orders.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>Không tìm thấy đơn hàng nào.</p>
        ) : (
          orders.map(order => (
            <RestaurantOrderCard
              key={order.MaDonHang}
              order={order}
              onConfirm={onConfirmOrder}
              onReady={onReadyOrder}
              onReject={onRejectOrder}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManager;
