import React, { useState, useEffect } from 'react';
import { adminService, Order, AdminUser } from '../services/apiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../assets/css/admin.css';

type TabType = 'dashboard' | 'orders' | 'users' | 'restaurant' | 'categories' | 'foods';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // ---- Dashboard ----
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [topFoods, setTopFoods] = useState<any[]>([]);
  const [topShippers, setTopShippers] = useState<any[]>([]);
  const [revenuePeriod, setRevenuePeriod] = useState<'day' | 'week' | 'month'>('month');

  // ---- Orders ----
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersPage, setOrdersPage] = useState(1);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shipperList, setShipperList] = useState<any[]>([]);
  const [assigningShipper, setAssigningShipper] = useState<number | null>(null);

  // ---- Users ----
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [userRoleFilter, setUserRoleFilter] = useState('');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [userForm, setUserForm] = useState({
    username: '', password: '', vaiTro: 'Shipper' as 'NhanVien' | 'Shipper',
    hoTen: '', soDienThoai: '', diaChi: '', bienSoXe: '',
  });
  const [resetPwdForm, setResetPwdForm] = useState({ userId: 0, newPassword: '' });
  const [isResetPwdModalOpen, setIsResetPwdModalOpen] = useState(false);

  // ---- Restaurant ----
  const [restaurant, setRestaurant] = useState<any>(null);
  const [restaurantForm, setRestaurantForm] = useState({
    tenNhaHang: '', diaChi: '', soDienThoai: '', hinhAnh: '', minOrder: 0, maCode: '',
  });

  // ---- Categories ----
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState({ tenDanhMuc: '' });

  // ---- Foods ----
  const [foods, setFoods] = useState<any[]>([]);
  const [foodsPage, setFoodsPage] = useState(1);
  const [foodsTotal, setFoodsTotal] = useState(0);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<any>(null);
  const [foodForm, setFoodForm] = useState({
    tenMon: '', gia: '', moTa: '', hinhAnh: '', maDanhMuc: 1, soLuong: 100,
  });

  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab]);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const loadTab = async (tab: TabType) => {
    switch (tab) {
      case 'dashboard': await loadDashboard(); break;
      case 'orders': await loadOrders(); break;
      case 'users': await loadUsers(); break;
      case 'restaurant': await loadRestaurant(); break;
      case 'categories': await loadCategories(); break;
      case 'foods': await loadFoods(); break;
    }
  };

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, revenueRes, foodsRes, shippersRes] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRevenueStats({ period: revenuePeriod }),
        adminService.getTopFoods({ limit: 5 }),
        adminService.getTopShippers({ limit: 5 }),
      ]);
      setStats(statsRes.stats);
      setRevenueData(revenueRes.revenueStats);
      setTopFoods(foodsRes.topFoods);
      setTopShippers(shippersRes.topShippers);
    } catch (err) {
      console.error('Lỗi dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (page = ordersPage, status = orderStatusFilter) => {
    setLoading(true);
    try {
      const res = await adminService.getAllOrders({ status: status || undefined, page, limit: 20 });
      setOrders(res.orders);
      setOrdersTotal(res.total);
    } catch (err) {
      console.error('Lỗi orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async (page = usersPage, role = userRoleFilter) => {
    setLoading(true);
    try {
      const res = await adminService.getAllUsers({ vaiTro: role || undefined, page, limit: 20 });
      setUsers(res.users);
      setUsersTotal(res.total);
    } catch (err) {
      console.error('Lỗi users:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRestaurant = async () => {
    try {
      const res = await adminService.getRestaurant();
      setRestaurant(res.restaurant);
      setRestaurantForm({
        tenNhaHang: res.restaurant?.TenNhaHang || '',
        diaChi: res.restaurant?.DiaChi || '',
        soDienThoai: res.restaurant?.SoDienThoai || '',
        hinhAnh: res.restaurant?.HinhAnh || '',
        minOrder: res.restaurant?.MinOrder || 0,
        maCode: res.restaurant?.MaCode || '',
      });
    } catch (err) {
      console.error('Lỗi restaurant:', err);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await adminService.getCategories();
      setCategories(res.categories);
    } catch (err) {
      console.error('Lỗi categories:', err);
    }
  };

  const loadFoods = async (page = foodsPage) => {
    setLoading(true);
    try {
      const res = await adminService.getFoodsAdmin();
      setFoods(res.foods);
      setFoodsTotal(res.foods.length);
    } catch (err) {
      console.error('Lỗi foods:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignShipper = async (orderId: number, maShipper: number) => {
    try {
      await adminService.assignShipper(orderId, maShipper);
      showMsg('success', 'Giao đơn cho shipper thành công');
      setAssigningShipper(null);
      loadOrders();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Giao đơn thất bại');
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Hủy đơn hàng này?')) return;
    try {
      await adminService.cancelOrderByAdmin(orderId);
      showMsg('success', 'Hủy đơn thành công');
      loadOrders();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Hủy đơn thất bại');
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createUser(userForm);
      showMsg('success', 'Tạo tài khoản thành công');
      setIsUserModalOpen(false);
      setUserForm({ username: '', password: '', vaiTro: 'Shipper', hoTen: '', soDienThoai: '', diaChi: '', bienSoXe: '' });
      loadUsers();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Tạo tài khoản thất bại');
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      await adminService.updateUser(editingUser.MaTK, {
        hoTen: userForm.hoTen,
        soDienThoai: userForm.soDienThoai,
        diaChi: userForm.diaChi,
        bienSoXe: userForm.bienSoXe,
      });
      showMsg('success', 'Cập nhật thành công');
      setIsUserModalOpen(false);
      setEditingUser(null);
      setUserForm({ username: '', password: '', vaiTro: 'Shipper', hoTen: '', soDienThoai: '', diaChi: '', bienSoXe: '' });
      loadUsers();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm('Xóa tài khoản này?')) return;
    try {
      await adminService.deleteUser(userId);
      showMsg('success', 'Xóa tài khoản thành công');
      loadUsers();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.resetPassword(resetPwdForm.userId, resetPwdForm.newPassword);
      showMsg('success', 'Đặt lại mật khẩu thành công');
      setIsResetPwdModalOpen(false);
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Đặt lại thất bại');
    }
  };

  const handleUpdateRestaurant = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.updateRestaurant({ ...restaurantForm });
      showMsg('success', 'Cập nhật nhà hàng thành công');
      loadRestaurant();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createCategory(categoryForm.tenDanhMuc);
      showMsg('success', 'Thêm danh mục thành công');
      setIsCategoryModalOpen(false);
      setCategoryForm({ tenDanhMuc: '' });
      loadCategories();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Thêm thất bại');
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      await adminService.updateCategory(editingCategory.MaDanhMuc, categoryForm.tenDanhMuc);
      showMsg('success', 'Cập nhật danh mục thành công');
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      setCategoryForm({ tenDanhMuc: '' });
      loadCategories();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!window.confirm('Xóa danh mục này?')) return;
    try {
      await adminService.deleteCategory(id);
      showMsg('success', 'Xóa danh mục thành công');
      loadCategories();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Xóa thất bại');
    }
  };

  const handleCreateFood = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createFood({
        tenMon: foodForm.tenMon,
        gia: Number(foodForm.gia),
        moTa: foodForm.moTa,
        hinhAnh: foodForm.hinhAnh,
        maDanhMuc: Number(foodForm.maDanhMuc),
        soLuong: Number(foodForm.soLuong),
      });
      showMsg('success', 'Thêm món ăn thành công');
      setIsFoodModalOpen(false);
      setFoodForm({ tenMon: '', gia: '', moTa: '', hinhAnh: '', maDanhMuc: 1, soLuong: 100 });
      loadFoods();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Thêm thất bại');
    }
  };

  const handleUpdateFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFood) return;
    try {
      await adminService.updateFood(editingFood.MaMonAn, {
        tenMon: foodForm.tenMon,
        gia: Number(foodForm.gia),
        moTa: foodForm.moTa,
        hinhAnh: foodForm.hinhAnh,
        maDanhMuc: Number(foodForm.maDanhMuc),
        soLuong: Number(foodForm.soLuong),
      });
      showMsg('success', 'Cập nhật món ăn thành công');
      setIsFoodModalOpen(false);
      setEditingFood(null);
      setFoodForm({ tenMon: '', gia: '', moTa: '', hinhAnh: '', maDanhMuc: 1, soLuong: 100 });
      loadFoods();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Cập nhật thất bại');
    }
  };

  const handleDeleteFood = async (id: number) => {
    if (!window.confirm('Xóa món ăn này?')) return;
    try {
      await adminService.deleteFood(id);
      showMsg('success', 'Xóa món ăn thành công');
      loadFoods();
    } catch (err: any) {
      showMsg('error', err?.response?.data?.message || 'Xóa thất bại');
    }
  };

  const openUserModal = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user);
      setUserForm({
        username: user.Username || '',
        password: '',
        vaiTro: (user.VaiTro as 'NhanVien' | 'Shipper') || 'Shipper',
        hoTen: user.HoTen || '',
        soDienThoai: user.SoDienThoai || user.ShipperSDT || '',
        diaChi: user.DiaChi || '',
        bienSoXe: user.BienSoXe || '',
      });
    } else {
      setEditingUser(null);
      setUserForm({ username: '', password: '', vaiTro: 'Shipper', hoTen: '', soDienThoai: '', diaChi: '', bienSoXe: '' });
    }
    setIsUserModalOpen(true);
  };

  const openCategoryModal = (cat?: any) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({ tenDanhMuc: cat.TenDanhMuc });
    } else {
      setEditingCategory(null);
      setCategoryForm({ tenDanhMuc: '' });
    }
    setIsCategoryModalOpen(true);
  };

  const openFoodModal = (food?: any) => {
    if (food) {
      setEditingFood(food);
      setFoodForm({
        tenMon: food.TenMon || '',
        gia: String(food.Gia || ''),
        moTa: food.MoTa || '',
        hinhAnh: food.HinhAnh || '',
        maDanhMuc: food.MaDanhMuc || 1,
        soLuong: food.SoLuong || 100,
      });
    } else {
      setEditingFood(null);
      setFoodForm({ tenMon: '', gia: '', moTa: '', hinhAnh: '', maDanhMuc: 1, soLuong: 100 });
    }
    setIsFoodModalOpen(true);
  };

  const getRoleBadge = (vaiTro: string) => {
    const map: Record<string, string> = {
      Admin: 'badge-admin', NhanVien: 'badge-nhanvien', Shipper: 'badge-shipper', KhachHang: 'badge-customer',
    };
    return <span className={`badge ${map[vaiTro] || 'badge-customer'}`}>{vaiTro}</span>;
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      ChoXacNhan: '#ffc107', DaXacNhan: '#17a2b8', DangChuanBi: '#6c42f5',
      SanSangGiao: '#f06595', DangGiao: '#0d6efd', DaGiao: '#28a745', Huy: '#dc3545',
    };
    const labels: Record<string, string> = {
      ChoXacNhan: 'Chờ xác nhận', DaXacNhan: 'Đã xác nhận', DangChuanBi: 'Đang chuẩn bị',
      SanSangGiao: 'Sẵn sàng giao', DangGiao: 'Đang giao', DaGiao: 'Đã giao', Huy: 'Đã hủy',
    };
    return (
      <span style={{ backgroundColor: colors[status] || '#6c757d', color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600 }}>
        {labels[status] || status}
      </span>
    );
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'orders', label: 'Đơn hàng', icon: '📦' },
    { id: 'users', label: 'Người dùng', icon: '👥' },
    { id: 'restaurant', label: 'Nhà hàng', icon: '🍽️' },
    { id: 'categories', label: 'Danh mục', icon: '📁' },
    { id: 'foods', label: 'Món ăn', icon: '🍔' },
  ];

  return (
    <div className="admin-page-wrapper">
      {/* Header */}
      <div className="admin-header">
        <div className="header_top">
          <div className="admin-container">
            <div className="header_top_left">
              <div className="header_logo">
                <a href="/">
                  <img src="/images/Logo_icon.png" alt="Logo" className="Logo_icon" />
                </a>
              </div>
            </div>
            <div className="header_top_middle" />
            <ul className="header_list">
              <li className="account">
                <span>👤 Admin</span>
                <ul className="account_manager">
                  <li onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>🚪 Đăng xuất</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="admin-main">
        {/* Sidebar */}
        <div className="main_left">
          <div className="menu">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={`menu-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id as TabType)}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="main_right">
          {message && (
            <div style={{
              padding: '12px 20px', borderRadius: '8px', marginBottom: '16px',
              backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
              color: message.type === 'success' ? '#155724' : '#721c24',
              border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            }}>
              {message.text}
            </div>
          )}

          {/* ===== DASHBOARD ===== */}
          {activeTab === 'dashboard' && (
            <div>
              <div className="welcome">
                <h3>📊 Dashboard</h3>
                <p>Chào mừng đến trang quản trị Giao Đồ Ăn</p>
              </div>

              {/* Stats Cards */}
              {stats && (
                <div className="stats-grid">
                  <div className="card">
                    <div>👥</div>
                    <span>{stats.totalUsers}</span>
                    <p>Tổng tài khoản</p>
                  </div>
                  <div className="card">
                    <div>📦</div>
                    <span>{stats.totalOrders}</span>
                    <p>Tổng đơn hàng</p>
                  </div>
                  <div className="card">
                    <div>💰</div>
                    <span>{formatCurrency(stats.totalRevenue)}</span>
                    <p>Tổng doanh thu</p>
                  </div>
                  <div className="card">
                    <div>⏳</div>
                    <span>{stats.pendingOrders}</span>
                    <p>Đơn chờ xử lý</p>
                  </div>
                  <div className="card">
                    <div>✅</div>
                    <span>{stats.completedOrders}</span>
                    <p>Đơn đã giao</p>
                  </div>
                  <div className="card">
                    <div>❌</div>
                    <span>{stats.cancelledOrders}</span>
                    <p>Đơn đã hủy</p>
                  </div>
                  <div className="card">
                    <div>🛵</div>
                    <span>{stats.shippers}</span>
                    <p>Shipper</p>
                  </div>
                  <div className="card">
                    <div>👔</div>
                    <span>{stats.staff}</span>
                    <p>Nhân viên</p>
                  </div>
                </div>
              )}

              {/* Revenue Chart */}
              <div className="box" style={{ marginTop: '20px' }}>
                <h4>📈 Biểu đồ doanh thu</h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  {(['day', 'week', 'month'] as const).map((p) => (
                    <button key={p} className={`filter-btn ${revenuePeriod === p ? 'active' : ''}`}
                      onClick={async () => { setRevenuePeriod(p); const r = await adminService.getRevenueStats({ period: p }); setRevenueData(r.revenueStats); }}>
                      {p === 'day' ? 'Theo ngày' : p === 'week' ? 'Theo tuần' : 'Theo tháng'}
                    </button>
                  ))}
                </div>
                {revenueData.length > 0 ? (
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Label" />
                        <YAxis tickFormatter={(v: any) => `${(Number(v) / 1000).toFixed(0)}K`} />
                        <Tooltip formatter={(value: any) => [`${Number(value).toLocaleString()}đ`, 'Doanh thu']} />
                        <Bar dataKey="DoanhThu" fill="#f08550" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p style={{ textAlign: 'center', color: '#999' }}>Không có dữ liệu</p>
                )}
              </div>

              {/* Top Foods & Top Shippers */}
              <div className="content" style={{ marginTop: '20px' }}>
                <div className="box">
                  <h4>🍔 Top món ăn</h4>
                  {topFoods.map((f: any, i: number) => (
                    <div key={f.MaMonAn} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < topFoods.length - 1 ? '1px solid #eee' : 'none' }}>
                      <div>
                        <strong>{f.TenMon}</strong>
                        <div style={{ fontSize: '12px', color: '#888' }}>Đã bán: {f.TongSoLuong} | {f.SoLanDat} đơn</div>
                      </div>
                      <strong style={{ color: '#f08550' }}>{formatCurrency(f.TongDoanhThu)}</strong>
                    </div>
                  ))}
                  {topFoods.length === 0 && <p style={{ color: '#999' }}>Chưa có dữ liệu</p>}
                </div>
                <div className="box">
                  <h4>🛵 Top shipper</h4>
                  {topShippers.map((s: any, i: number) => (
                    <div key={s.MaShipper} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < topShippers.length - 1 ? '1px solid #eee' : 'none' }}>
                      <div>
                        <strong>{s.HoTen}</strong>
                        <div style={{ fontSize: '12px', color: '#888' }}>Đã giao: {s.DonDaGiao} | Đang giao: {s.DonDangGiao}</div>
                      </div>
                      <strong style={{ color: '#f08550' }}>{formatCurrency(s.TongPhiShip)}</strong>
                    </div>
                  ))}
                  {topShippers.length === 0 && <p style={{ color: '#999' }}>Chưa có dữ liệu</p>}
                </div>
              </div>
            </div>
          )}

          {/* ===== ORDERS ===== */}
          {activeTab === 'orders' && (
            <div>
              <div className="welcome">
                <h3>📦 Quản lý đơn hàng</h3>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {['', 'ChoXacNhan', 'DaXacNhan', 'DangChuanBi', 'SanSangGiao', 'DangGiao', 'DaGiao', 'Huy'].map((s) => (
                  <button key={s} className={`filter-btn ${orderStatusFilter === s ? 'active' : ''}`}
                    onClick={() => { setOrderStatusFilter(s); setOrdersPage(1); loadOrders(1, s); }}>
                    {s === '' ? 'Tất cả' : s === 'ChoXacNhan' ? 'Chờ xác nhận' : s === 'DaXacNhan' ? 'Đã xác nhận' : s === 'DangChuanBi' ? 'Đang chuẩn bị' : s === 'SanSangGiao' ? 'Sẵn sàng giao' : s === 'DangGiao' ? 'Đang giao' : s === 'DaGiao' ? 'Đã giao' : 'Đã hủy'}
                  </button>
                ))}
              </div>

              {loading ? (
                <p>Đang tải...</p>
              ) : (
                <>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Mã</th><th>Khách hàng</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Trạng thái</th><th>Shipper</th><th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o.MaDonHang}>
                            <td>#{o.MaDonHang}</td>
                            <td>{o.TenKhachHang || 'N/A'}<br/><small>{o.KhachHangSDT || ''}</small></td>
                            <td>{new Date(o.NgayDat).toLocaleString('vi-VN')}</td>
                            <td>{formatCurrency(o.TongTien)}</td>
                            <td>{getStatusBadge(o.TrangThai)}</td>
                            <td>{o.TenShipper || '—'}</td>
                            <td>
                              <button className="filter-btn" style={{ marginRight: '4px', background: '#17a2b8', color: '#fff' }}
                                onClick={() => { setSelectedOrder(o); setAssigningShipper(o.MaDonHang); setShipperList(topShippers); }}>
                                Giao
                              </button>
                              {o.TrangThai !== 'DaGiao' && o.TrangThai !== 'Huy' && (
                                <button className="filter-btn" style={{ background: '#dc3545', color: '#fff' }}
                                  onClick={() => handleCancelOrder(o.MaDonHang)}>Hủy</button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr><td colSpan={7} style={{ textAlign: 'center', color: '#999' }}>Không có đơn hàng</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {ordersTotal > 20 && (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                      <button className="filter-btn" disabled={ordersPage <= 1} onClick={() => { const p = ordersPage - 1; setOrdersPage(p); loadOrders(p); }}>← Trước</button>
                      <span style={{ lineHeight: '32px' }}>Trang {ordersPage} / {Math.ceil(ordersTotal / 20)}</span>
                      <button className="filter-btn" disabled={ordersPage >= Math.ceil(ordersTotal / 20)} onClick={() => { const p = ordersPage + 1; setOrdersPage(p); loadOrders(p); }}>Sau →</button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ===== USERS ===== */}
          {activeTab === 'users' && (
            <div>
              <div className="welcome" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>👥 Quản lý người dùng</h3>
                <button className="btn-primary" onClick={() => openUserModal()}>+ Thêm tài khoản</button>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {['', 'NhanVien', 'Shipper', 'KhachHang', 'Admin'].map((r) => (
                  <button key={r} className={`filter-btn ${userRoleFilter === r ? 'active' : ''}`}
                    onClick={() => { setUserRoleFilter(r); setUsersPage(1); loadUsers(1, r); }}>
                    {r === '' ? 'Tất cả' : r}
                  </button>
                ))}
              </div>

              {loading ? <p>Đang tải...</p> : (
                <>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr><th>ID</th><th>Username</th><th>Vai trò</th><th>Họ tên</th><th>Liên hệ</th><th>Ngày tạo</th><th>Thao tác</th></tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.MaTK}>
                            <td>#{u.MaTK}</td>
                            <td>{u.Username}</td>
                            <td>{getRoleBadge(u.VaiTro)}</td>
                            <td>{u.HoTen || '—'}</td>
                            <td>{u.SoDienThoai || u.ShipperSDT || '—'}<br/><small>{u.DiaChi || ''}</small></td>
                            <td>{u.NgayTao ? new Date(u.NgayTao).toLocaleDateString('vi-VN') : '—'}</td>
                            <td>
                              <button className="filter-btn" style={{ marginRight: '4px', background: '#17a2b8', color: '#fff' }}
                                onClick={() => openUserModal(u)}>Sửa</button>
                              <button className="filter-btn" style={{ marginRight: '4px', background: '#ffc107', color: '#fff' }}
                                onClick={() => { setResetPwdForm({ userId: u.MaTK, newPassword: '' }); setIsResetPwdModalOpen(true); }}>MK</button>
                              {u.VaiTro !== 'Admin' && (
                                <button className="filter-btn" style={{ background: '#dc3545', color: '#fff' }}
                                  onClick={() => handleDeleteUser(u.MaTK)}>Xóa</button>
                              )}
                            </td>
                          </tr>
                        ))}
                        {users.length === 0 && (
                          <tr><td colSpan={7} style={{ textAlign: 'center', color: '#999' }}>Không có người dùng</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {usersTotal > 20 && (
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '16px' }}>
                      <button className="filter-btn" disabled={usersPage <= 1} onClick={() => { const p = usersPage - 1; setUsersPage(p); loadUsers(p); }}>← Trước</button>
                      <span style={{ lineHeight: '32px' }}>Trang {usersPage} / {Math.ceil(usersTotal / 20)}</span>
                      <button className="filter-btn" disabled={usersPage >= Math.ceil(usersTotal / 20)} onClick={() => { const p = usersPage + 1; setUsersPage(p); loadUsers(p); }}>Sau →</button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ===== RESTAURANT ===== */}
          {activeTab === 'restaurant' && (
            <div>
              <div className="welcome">
                <h3>🍽️ Quản lý nhà hàng</h3>
              </div>
              <div className="table-container">
                <form onSubmit={handleUpdateRestaurant}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Tên nhà hàng</label>
                      <input value={restaurantForm.tenNhaHang} onChange={e => setRestaurantForm({ ...restaurantForm, tenNhaHang: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Số điện thoại</label>
                      <input value={restaurantForm.soDienThoai} onChange={e => setRestaurantForm({ ...restaurantForm, soDienThoai: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Địa chỉ</label>
                      <input value={restaurantForm.diaChi} onChange={e => setRestaurantForm({ ...restaurantForm, diaChi: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Mã code</label>
                      <input value={restaurantForm.maCode} onChange={e => setRestaurantForm({ ...restaurantForm, maCode: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Min order (VNĐ)</label>
                      <input type="number" value={restaurantForm.minOrder} onChange={e => setRestaurantForm({ ...restaurantForm, minOrder: Number(e.target.value) })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Link hình ảnh</label>
                      <input value={restaurantForm.hinhAnh} onChange={e => setRestaurantForm({ ...restaurantForm, hinhAnh: e.target.value })}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                    </div>
                  </div>
                  {restaurantForm.hinhAnh && (
                    <div style={{ marginTop: '12px' }}>
                      <img src={restaurantForm.hinhAnh} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }}
                        onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                  <button type="submit" className="btn-primary" style={{ marginTop: '20px' }}>💾 Lưu thông tin</button>
                </form>
              </div>
            </div>
          )}

          {/* ===== CATEGORIES ===== */}
          {activeTab === 'categories' && (
            <div>
              <div className="welcome" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>📁 Quản lý danh mục</h3>
                <button className="btn-primary" onClick={() => openCategoryModal()}>+ Thêm danh mục</button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead><tr><th>ID</th><th>Tên danh mục</th><th>Số món</th><th>Thao tác</th></tr></thead>
                  <tbody>
                    {categories.map((c) => (
                      <tr key={c.MaDanhMuc}>
                        <td>#{c.MaDanhMuc}</td>
                        <td>{c.TenDanhMuc}</td>
                        <td>{c.SoMonAn}</td>
                        <td>
                          <button className="filter-btn" style={{ marginRight: '4px', background: '#17a2b8', color: '#fff' }}
                            onClick={() => openCategoryModal(c)}>Sửa</button>
                          <button className="filter-btn" style={{ background: '#dc3545', color: '#fff' }}
                            onClick={() => handleDeleteCategory(c.MaDanhMuc)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr><td colSpan={4} style={{ textAlign: 'center', color: '#999' }}>Chưa có danh mục</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===== FOODS ===== */}
          {activeTab === 'foods' && (
            <div>
              <div className="welcome" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>🍔 Quản lý món ăn</h3>
                <button className="btn-primary" onClick={() => openFoodModal()}>+ Thêm món</button>
              </div>
              {loading ? <p>Đang tải...</p> : (
                <div className="table-container">
                  <table className="data-table">
                    <thead><tr><th>ID</th><th>Tên món</th><th>Danh mục</th><th>Giá</th><th>Tồn kho</th><th>Thao tác</th></tr></thead>
                    <tbody>
                      {foods.map((f) => (
                        <tr key={f.MaMonAn}>
                          <td>#{f.MaMonAn}</td>
                          <td>{f.TenMon}</td>
                          <td>{f.TenDanhMuc}</td>
                          <td>{formatCurrency(f.Gia)}</td>
                          <td>{f.SoLuong}</td>
                          <td>
                            <button className="filter-btn" style={{ marginRight: '4px', background: '#17a2b8', color: '#fff' }}
                              onClick={() => openFoodModal(f)}>Sửa</button>
                            <button className="filter-btn" style={{ background: '#dc3545', color: '#fff' }}
                              onClick={() => handleDeleteFood(f.MaMonAn)}>Xóa</button>
                          </td>
                        </tr>
                      ))}
                      {foods.length === 0 && (
                        <tr><td colSpan={6} style={{ textAlign: 'center', color: '#999' }}>Chưa có món ăn</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===== MODALS ===== */}

      {/* Assign Shipper Modal */}
      {selectedOrder && (
        <div className="modal" onClick={() => { setSelectedOrder(null); setAssigningShipper(null); }}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-modal" onClick={() => { setSelectedOrder(null); setAssigningShipper(null); }}>&times;</span>
            <h3>Giao đơn #{selectedOrder.MaDonHang}</h3>
            <p>Khách hàng: <strong>{selectedOrder.TenKhachHang}</strong></p>
            <p>Địa chỉ: <strong>{selectedOrder.DiaChiGiao}</strong></p>
            <p>Tổng tiền: <strong>{formatCurrency(selectedOrder.TongTien)}</strong></p>
            <hr />
            <h4>Chọn Shipper</h4>
            {topShippers.length > 0 ? (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {topShippers.map((s: any) => (
                  <div key={s.MaShipper} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', alignItems: 'center' }}>
                    <div>
                      <strong>{s.HoTen}</strong>
                      <div style={{ fontSize: '12px', color: '#888' }}>{s.SoDienThoai} | Biển số: {s.BienSoXe}</div>
                    </div>
                    <button className="btn-primary" onClick={() => handleAssignShipper(selectedOrder.MaDonHang, s.MaShipper)}>Giao</button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#999' }}>Chưa có shipper nào.</p>
            )}
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="modal" onClick={() => setIsUserModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setIsUserModalOpen(false)}>&times;</span>
            <h3>{editingUser ? 'Sửa tài khoản' : 'Thêm tài khoản'}</h3>
            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Username *</label>
                <input value={userForm.username} onChange={e => setUserForm({ ...userForm, username: e.target.value })} required={!editingUser} disabled={!!editingUser}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              {!editingUser && (
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Password *</label>
                  <input type="password" value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })} required
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
              )}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Vai trò *</label>
                <select value={userForm.vaiTro} onChange={e => setUserForm({ ...userForm, vaiTro: e.target.value as 'NhanVien' | 'Shipper' })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}>
                  <option value="NhanVien">Nhân viên</option>
                  <option value="Shipper">Shipper</option>
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Họ tên *</label>
                <input value={userForm.hoTen} onChange={e => setUserForm({ ...userForm, hoTen: e.target.value })} required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Số điện thoại</label>
                <input value={userForm.soDienThoai} onChange={e => setUserForm({ ...userForm, soDienThoai: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Địa chỉ</label>
                <input value={userForm.diaChi} onChange={e => setUserForm({ ...userForm, diaChi: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              {userForm.vaiTro === 'Shipper' && (
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Biển số xe</label>
                  <input value={userForm.bienSoXe} onChange={e => setUserForm({ ...userForm, bienSoXe: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
              )}
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                {editingUser ? '💾 Lưu thay đổi' : '➕ Tạo tài khoản'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {isResetPwdModalOpen && (
        <div className="modal" onClick={() => setIsResetPwdModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setIsResetPwdModalOpen(false)}>&times;</span>
            <h3>Đặt lại mật khẩu</h3>
            <form onSubmit={handleResetPassword}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Mật khẩu mới (tối thiểu 5 ký tự)</label>
                <input type="password" value={resetPwdForm.newPassword} onChange={e => setResetPwdForm({ ...resetPwdForm, newPassword: e.target.value })} required minLength={5}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>💾 Đặt lại mật khẩu</button>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && (
        <div className="modal" onClick={() => setIsCategoryModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setIsCategoryModalOpen(false)}>&times;</span>
            <h3>{editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}</h3>
            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Tên danh mục *</label>
                <input value={categoryForm.tenDanhMuc} onChange={e => setCategoryForm({ tenDanhMuc: e.target.value })} required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                {editingCategory ? '💾 Lưu thay đổi' : '➕ Thêm danh mục'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Food Modal */}
      {isFoodModalOpen && (
        <div className="modal" onClick={() => setIsFoodModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <span className="close-modal" onClick={() => setIsFoodModalOpen(false)}>&times;</span>
            <h3>{editingFood ? 'Sửa món ăn' : 'Thêm món ăn'}</h3>
            <form onSubmit={editingFood ? handleUpdateFood : handleCreateFood}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Tên món *</label>
                <input value={foodForm.tenMon} onChange={e => setFoodForm({ ...foodForm, tenMon: e.target.value })} required
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Giá (VNĐ) *</label>
                  <input type="number" value={foodForm.gia} onChange={e => setFoodForm({ ...foodForm, gia: e.target.value })} required min={1}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Tồn kho</label>
                  <input type="number" value={foodForm.soLuong} onChange={e => setFoodForm({ ...foodForm, soLuong: Number(e.target.value) })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Danh mục *</label>
                <select value={foodForm.maDanhMuc} onChange={e => setFoodForm({ ...foodForm, maDanhMuc: Number(e.target.value) })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }}>
                  {categories.map((c) => (
                    <option key={c.MaDanhMuc} value={c.MaDanhMuc}>{c.TenDanhMuc}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Link hình ảnh</label>
                <input value={foodForm.hinhAnh} onChange={e => setFoodForm({ ...foodForm, hinhAnh: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', marginBottom: '4px', fontWeight: 600 }}>Mô tả</label>
                <textarea value={foodForm.moTa} onChange={e => setFoodForm({ ...foodForm, moTa: e.target.value })} rows={3}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', resize: 'vertical' }} />
              </div>
              {foodForm.hinhAnh && (
                <div style={{ marginBottom: '12px' }}>
                  <img src={foodForm.hinhAnh} alt="Preview" style={{ maxWidth: '150px', borderRadius: '8px' }}
                    onError={e => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                {editingFood ? '💾 Lưu thay đổi' : '➕ Thêm món ăn'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
