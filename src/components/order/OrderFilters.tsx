import React from 'react';

interface OrderFiltersProps {
  filter: string;
  onFilterChange: (filter: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ filter, onFilterChange }) => {
  const filters = [
    { id: 'all', icon: 'fa-list', label: 'Tất cả' },
    { id: 'ChoXacNhan', icon: 'fa-clock', label: 'Đang chờ' },
    { id: 'DangChuanBi', icon: 'fa-utensils', label: 'Đang nấu' },
    { id: 'SanSangGiao', icon: 'fa-check-circle', label: 'Sẵn sàng' },
    { id: 'DangGiao', icon: 'fa-truck', label: 'Đang giao' },
    { id: 'DaGiao', icon: 'fa-check-double', label: 'Đã giao' },
    { id: 'Huy', icon: 'fa-times-circle', label: 'Đã hủy' }
  ];

  return (
    <div className="orders-filter-tabs">
      {filters.map(tab => (
        <button
          key={tab.id}
          className={`filter-tab ${filter === tab.id ? 'active' : ''}`}
          onClick={() => onFilterChange(tab.id)}
        >
          <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
        </button>
      ))}
    </div>
  );
};

export default OrderFilters;
