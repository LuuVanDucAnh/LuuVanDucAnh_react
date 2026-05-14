import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../services/apiService';
import { getImageUrl } from '../utils/image';
import '../assets/css/admin.css';
import LogoIcon from '../images/Logo_icon.png';

const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [cartCount, setCartCount] = useState(0);
    const [loading, setLoading] = useState(false);

    // Dashboard state
    const [stats, setStats] = useState<any>(null);
    const [topFoods, setTopFoods] = useState<any[]>([]);
    const [topShippers, setTopShippers] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any[]>([]);

    // Users state
    const [users, setUsers] = useState<any[]>([]);
    const [usersLoading, setUsersLoading] = useState(false);

    // Restaurant state
    const [restaurant, setRestaurant] = useState<any>(null);
    const [restaurantLoading, setRestaurantLoading] = useState(false);

    // Orders state
    const [orders, setOrders] = useState<any[]>([]);
    const [ordersTotal, setOrdersTotal] = useState(0);
    const [ordersPage, setOrdersPage] = useState(1);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [orderDetail, setOrderDetail] = useState<any>(null);

    // Foods & Categories state
    const [foods, setFoods] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [foodsLoading, setFoodsLoading] = useState(false);

    // Modal state
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);
    const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingFood, setEditingFood] = useState<any>(null);

    useEffect(() => {
        const user = localStorage.getItem("currentUser");
        if (user) setCurrentUser(JSON.parse(user));

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartCount(cart.reduce((acc: number, item: any) => acc + item.quantity, 0));

        checkAdminAccess();
    }, []);

    useEffect(() => {
        if (activeTab === 'dashboard') fetchDashboard();
        else if (activeTab === 'users') fetchUsers();
        else if (activeTab === 'restaurants') fetchRestaurant();
        else if (activeTab === 'orders') fetchOrders();
        else if (activeTab === 'foods') { fetchFoods(); fetchCategories(); }
        else if (activeTab === 'statistics') fetchStats();
    }, [activeTab]);

    const checkAdminAccess = () => {
        const user = JSON.parse(localStorage.getItem("currentUser") || '{}');
        if (!user.vaiTro || user.vaiTro !== 'Admin') {
            alert("Bạn không có quyền truy cập trang Admin!");
            window.location.href = "/";
        }
    };

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const data = await adminService.getDashboardStats();
            setStats(data.stats);
        } catch (error) {
            console.error("Lỗi khi tải dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            const [topFoodsRes, topShippersRes, revenueRes] = await Promise.all([
                adminService.getTopFoods({ limit: 10 }),
                adminService.getTopShippers({ limit: 10 }),
                adminService.getRevenueStats({ period: 'month' }),
            ]);
            setTopFoods(topFoodsRes.topFoods || []);
            setTopShippers(topShippersRes.topShippers || []);
            setRevenueData(revenueRes.revenueStats || []);
        } catch (error) {
            console.error("Lỗi khi tải thống kê:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const res = await adminService.getAllUsers({ limit: 100 });
            setUsers(res.users || []);
        } catch (error) {
            console.error("Lỗi khi tải người dùng:", error);
        } finally {
            setUsersLoading(false);
        }
    };

    const fetchRestaurant = async () => {
        setRestaurantLoading(true);
        try {
            const res = await adminService.getRestaurant();
            setRestaurant(res.restaurant || null);
        } catch (error) {
            console.error("Lỗi khi tải nhà hàng:", error);
        } finally {
            setRestaurantLoading(false);
        }
    };

    const fetchOrders = async (page = 1) => {
        setOrdersLoading(true);
        try {
            const res = await adminService.getAllOrders({ page, limit: 20 });
            setOrders(res.orders || []);
            setOrdersTotal(res.total || 0);
            setOrdersPage(page);
        } catch (error) {
            console.error("Lỗi khi tải đơn hàng:", error);
        } finally {
            setOrdersLoading(false);
        }
    };

    const fetchFoods = async () => {
        setFoodsLoading(true);
        try {
            const res = await adminService.getFoodsAdmin();
            setFoods(res.foods || []);
        } catch (error) {
            console.error("Lỗi khi tải món ăn:", error);
        } finally {
            setFoodsLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await adminService.getCategories();
            setCategories(res.categories || []);
        } catch (error) {
            console.error("Lỗi khi tải danh mục:", error);
        }
    };

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("token");
            localStorage.removeItem("loginTime");
            window.location.href = "/";
        }
    };

    const handleAssignShipper = async (orderId: number, maShipper: number) => {
        try {
            await adminService.assignShipper(orderId, maShipper);
            alert("Gán shipper thành công!");
            fetchOrders(ordersPage);
            setIsOrderModalOpen(false);
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi gán shipper!");
        }
    };

    const handleCancelOrderAdmin = async (orderId: number) => {
        if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
        try {
            await adminService.cancelOrderByAdmin(orderId);
            alert("Hủy đơn hàng thành công!");
            fetchOrders(ordersPage);
            setIsOrderModalOpen(false);
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi hủy đơn!");
        }
    };

    const handleDeleteUser = async (maTK: number) => {
        if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) return;
        try {
            await adminService.deleteUser(maTK);
            alert("Xóa tài khoản thành công!");
            fetchUsers();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi xóa!");
        }
    };

    const handleDeleteFood = async (maMonAn: number) => {
        if (!window.confirm("Bạn có chắc muốn xóa món ăn này?")) return;
        try {
            await adminService.deleteFood(maMonAn);
            alert("Xóa món ăn thành công!");
            fetchFoods();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi xóa!");
        }
    };

    const handleDeleteCategory = async (maDanhMuc: number) => {
        if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
        try {
            await adminService.deleteCategory(maDanhMuc);
            alert("Xóa danh mục thành công!");
            fetchCategories();
        } catch (error: any) {
            alert(error.response?.data?.message || "Không thể xóa danh mục!");
        }
    };

    const handleSaveRestaurant = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        setLoading(true);
        try {
            await adminService.updateRestaurant({
                tenNhaHang: formData.get('tenNhaHang') as string,
                diaChi: formData.get('diaChi') as string,
                soDienThoai: formData.get('soDienThoai') as string,
                hinhAnh: formData.get('hinhAnh') as string,
                minOrder: parseFloat(formData.get('minOrder') as string) || 0,
                maCode: formData.get('maCode') as string,
            });
            alert("Cập nhật thành công!");
            setIsAddRestaurantModalOpen(false);
            fetchRestaurant();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi cập nhật!");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveFood = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        setLoading(true);
        try {
            const payload = {
                tenMon: formData.get('tenMon') as string,
                gia: parseFloat(formData.get('gia') as string),
                moTa: formData.get('moTa') as string,
                hinhAnh: formData.get('hinhAnh') as string,
                maDanhMuc: parseInt(formData.get('maDanhMuc') as string),
                soLuong: parseInt(formData.get('soLuong') as string) || 100,
            };
            if (editingFood) {
                await adminService.updateFood(editingFood.MaMonAn, payload);
            } else {
                await adminService.createFood(payload);
            }
            alert(editingFood ? "Cập nhật món ăn thành công!" : "Thêm món ăn thành công!");
            setIsFoodModalOpen(false);
            setEditingFood(null);
            fetchFoods();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi lưu món ăn!");
        } finally {
            setLoading(false);
        }
    };

    const handleSaveCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const tenDanhMuc = formData.get('tenDanhMuc') as string;
        const editId = formData.get('editId') as string;
        setLoading(true);
        try {
            if (editId) {
                await adminService.updateCategory(parseInt(editId), tenDanhMuc);
            } else {
                await adminService.createCategory(tenDanhMuc);
            }
            alert("Lưu thành công!");
            setIsCategoryModalOpen(false);
            fetchCategories();
        } catch (error: any) {
            alert(error.response?.data?.message || "Lỗi khi lưu!");
        } finally {
            setLoading(false);
        }
    };

    const openOrderDetail = (order: any) => {
        setSelectedOrder(order);
        setOrderDetail(order);
        setIsOrderModalOpen(true);
    };

    const getStatusClass = (status: string) => {
        if (!status) return '';
        return `badge-${status.toLowerCase().replace(/[^a-z]/g, '')}`;
    };

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

    return (
        <div className="admin-page-wrapper">
            {/* Header */}
            <div className="admin-header">
                <div className="header_top">
                    <div className="admin-container">
                        <div className="header_top_left">
                            <div className="header_logo">
                                <Link to="/"><img className="Logo_icon" src={LogoIcon} alt="Logo" /></Link>
                            </div>
                        </div>
                        <div className="header_top_right">
                            <ul className="header_list">
                                <li className="account">
                                    <i className="fa-solid fa-user"></i>
                                    <div className="text">
                                        <span className="text_tk" style={{ display: 'block' }}>
                                            {currentUser?.hoTen || currentUser?.username} <i className="fa-solid fa-caret-down"></i>
                                        </span>
                                    </div>
                                    <ul className="account_manager">
                                        <li className="yes_acc"><Link to="/admin"><i className="fa-solid fa-gear"></i> Quản lý</Link></li>
                                        <li className="yes_acc" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất</li>
                                    </ul>
                                </li>
                                <li className="cart">
                                    <Link to="/cart">
                                        <i className="fa-solid fa-cart-shopping">
                                            <div id="cart_number_items" style={{ display: cartCount > 0 ? 'block' : 'none' }}>{cartCount}</div>
                                        </i>
                                        <span>Giỏ hàng</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="admin-main">
                <div className="main_left">
                    <nav className="menu">
                        <div className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                            <i className="fa-solid fa-chart-line"></i> <span>Dashboard</span>
                        </div>
                        <div className={`menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                            <i className="fa-solid fa-users"></i> <span>Người dùng</span>
                        </div>
                        <div className={`menu-item ${activeTab === 'restaurants' ? 'active' : ''}`} onClick={() => setActiveTab('restaurants')}>
                            <i className="fa-solid fa-store"></i> <span>Nhà hàng</span>
                        </div>
                        <div className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                            <i className="fa-solid fa-clipboard-list"></i> <span>Đơn hàng</span>
                        </div>
                        <div className={`menu-item ${activeTab === 'foods' ? 'active' : ''}`} onClick={() => setActiveTab('foods')}>
                            <i className="fa-solid fa-burger"></i> <span>Món ăn</span>
                        </div>
                        <div className={`menu-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
                            <i className="fa-solid fa-list"></i> <span>Danh mục</span>
                        </div>
                        <div className={`menu-item ${activeTab === 'statistics' ? 'active' : ''}`} onClick={() => setActiveTab('statistics')}>
                            <i className="fa-solid fa-chart-pie"></i> <span>Thống kê</span>
                        </div>
                    </nav>
                </div>

                <div className="main_right">
                    {/* DASHBOARD */}
                    {activeTab === 'dashboard' && (
                        <section className="tab-content" id="dashboard">
                            <div className="welcome">
                                <h3>Chào mừng, {currentUser?.hoTen || currentUser?.username}</h3>
                                <p>Tổng quan hệ thống quản lý giao đồ ăn</p>
                            </div>
                            {loading ? <p>Đang tải...</p> : stats && (
                                <>
                                    <div className="stats">
                                        <div className="card">
                                            <i className="fa-solid fa-users"></i>
                                            <span>{stats.totalUsers || 0}</span>
                                            <p>Tổng người dùng</p>
                                        </div>
                                        <div className="card">
                                            <i className="fa-solid fa-clipboard-list"></i>
                                            <span>{stats.totalOrders || 0}</span>
                                            <p>Tổng đơn hàng</p>
                                        </div>
                                        <div className="card">
                                            <i className="fa-solid fa-money-bill-wave"></i>
                                            <span>{(stats.totalRevenue || 0).toLocaleString()}đ</span>
                                            <p>Tổng doanh thu</p>
                                        </div>
                                        <div className="card">
                                            <i className="fa-solid fa-clock"></i>
                                            <span>{stats.pendingOrders || 0}</span>
                                            <p>Đơn đang chờ</p>
                                        </div>
                                    </div>
                                    <div className="stats-grid">
                                        <div className="card">
                                            <i className="fa-solid fa-check-circle"></i>
                                            <span>{stats.completedOrders || 0}</span>
                                            <p>Đơn hoàn thành</p>
                                        </div>
                                        <div className="card">
                                            <i className="fa-solid fa-user-injured"></i>
                                            <span>{stats.cancelledOrders || 0}</span>
                                            <p>Đơn đã hủy</p>
                                        </div>
                                        <div className="card">
                                            <i className="fa-solid fa-users-cog"></i>
                                            <span>{stats.staff || 0}</span>
                                            <p>Nhân viên</p>
                                        </div>
                                        <div className="card">
                                            <i className="fa-solid fa-motorcycle"></i>
                                            <span>{stats.shippers || 0}</span>
                                            <p>Shipper</p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </section>
                    )}

                    {/* USERS */}
                    {activeTab === 'users' && (
                        <section className="tab-content">
                            <div className="section-header">
                                <h3>Quản lý người dùng</h3>
                                <button className="btn-primary" onClick={() => setActiveTab('users')}>
                                    <i className="fa-solid fa-refresh"></i> Làm mới
                                </button>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Họ tên</th>
                                            <th>Username</th>
                                            <th>Vai trò</th>
                                            <th>SĐT</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usersLoading ? (
                                            <tr><td colSpan={6}>Đang tải...</td></tr>
                                        ) : users.map(user => (
                                            <tr key={user.MaTK}>
                                                <td>{user.MaTK}</td>
                                                <td>{user.HoTen || '-'}</td>
                                                <td>{user.Username}</td>
                                                <td><span className={`badge ${getStatusClass(user.VaiTro)}`}>{user.VaiTro}</span></td>
                                                <td>{user.SoDienThoai || '-'}</td>
                                                <td>
                                                    <button className="btn-action btn-danger" onClick={() => handleDeleteUser(user.MaTK)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* RESTAURANT */}
                    {activeTab === 'restaurants' && (
                        <section className="tab-content">
                            <div className="section-header">
                                <h3>Quản lý nhà hàng</h3>
                                <button className="btn-primary" onClick={() => { fetchRestaurant(); setIsAddRestaurantModalOpen(true); }}>
                                    <i className="fa-solid fa-pen"></i> Chỉnh sửa
                                </button>
                            </div>
                            {restaurantLoading ? <p>Đang tải...</p> : restaurant && (
                                <div className="restaurants-grid">
                                    <div className="restaurant-card-admin">
                                        <div className="restaurant-card-image">
                                            <img src={getImageUrl(restaurant.HinhAnh)} alt={restaurant.TenNhaHang} />
                                        </div>
                                        <div className="restaurant-card-info">
                                            <h4>{restaurant.TenNhaHang}</h4>
                                            <p><i className="fa-solid fa-location-dot"></i> {restaurant.DiaChi}</p>
                                            <p><i className="fa-solid fa-phone"></i> {restaurant.SoDienThoai}</p>
                                            <p><i className="fa-solid fa-money-bill"></i> Min: {Number(restaurant.MinOrder).toLocaleString()}đ</p>
                                            <p><i className="fa-solid fa-tag"></i> Mã: {restaurant.MaCode}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* ORDERS */}
                    {activeTab === 'orders' && (
                        <section className="tab-content">
                            <div className="section-header">
                                <h3>Quản lý đơn hàng</h3>
                                <button className="btn-primary" onClick={() => fetchOrders(ordersPage)}>
                                    <i className="fa-solid fa-refresh"></i> Làm mới
                                </button>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Mã</th>
                                            <th>Khách hàng</th>
                                            <th>Địa chỉ giao</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày đặt</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordersLoading ? (
                                            <tr><td colSpan={7}>Đang tải...</td></tr>
                                        ) : orders.length === 0 ? (
                                            <tr><td colSpan={7}>Chưa có đơn hàng nào.</td></tr>
                                        ) : orders.map(order => (
                                            <tr key={order.MaDonHang}>
                                                <td>#{order.MaDonHang}</td>
                                                <td>{order.TenKhachHang || order.MaKhachHang}</td>
                                                <td>{order.DiaChiGiao}</td>
                                                <td>{Number(order.TongTien).toLocaleString()}đ</td>
                                                <td><span className={`badge ${getStatusClass(order.TrangThai)}`}>{getStatusLabel(order.TrangThai)}</span></td>
                                                <td>{new Date(order.NgayDat).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="btn-action btn-primary" onClick={() => openOrderDetail(order)}>
                                                        <i className="fa-solid fa-eye"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* FOODS */}
                    {activeTab === 'foods' && (
                        <section className="tab-content">
                            <div className="section-header">
                                <h3>Quản lý món ăn</h3>
                                <button className="btn-primary" onClick={() => { setEditingFood(null); setIsFoodModalOpen(true); }}>
                                    <i className="fa-solid fa-plus"></i> Thêm món ăn
                                </button>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tên món</th>
                                            <th>Giá</th>
                                            <th>Danh mục</th>
                                            <th>Tồn kho</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {foodsLoading ? (
                                            <tr><td colSpan={6}>Đang tải...</td></tr>
                                        ) : foods.map(food => (
                                            <tr key={food.MaMonAn}>
                                                <td>{food.MaMonAn}</td>
                                                <td>{food.TenMon}</td>
                                                <td>{Number(food.Gia).toLocaleString()}đ</td>
                                                <td>{food.TenDanhMuc || food.MaDanhMuc}</td>
                                                <td>{food.SoLuong}</td>
                                                <td>
                                                    <button className="btn-action btn-primary" onClick={() => { setEditingFood(food); setIsFoodModalOpen(true); }}>
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>
                                                    <button className="btn-action btn-danger" onClick={() => handleDeleteFood(food.MaMonAn)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* CATEGORIES */}
                    {activeTab === 'categories' && (
                        <section className="tab-content">
                            <div className="section-header">
                                <h3>Quản lý danh mục</h3>
                                <button className="btn-primary" onClick={() => setIsCategoryModalOpen(true)}>
                                    <i className="fa-solid fa-plus"></i> Thêm danh mục
                                </button>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tên danh mục</th>
                                            <th>Số món ăn</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categories.map(cat => (
                                            <tr key={cat.MaDanhMuc}>
                                                <td>{cat.MaDanhMuc}</td>
                                                <td>{cat.TenDanhMuc}</td>
                                                <td>{cat.SoMonAn}</td>
                                                <td>
                                                    <button className="btn-action btn-danger" onClick={() => handleDeleteCategory(cat.MaDanhMuc)}>
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* STATISTICS */}
                    {activeTab === 'statistics' && (
                        <section className="tab-content">
                            <div className="section-header">
                                <h3>Thống kê & Báo cáo</h3>
                                <button className="btn-primary" onClick={() => fetchStats()}>
                                    <i className="fa-solid fa-refresh"></i> Làm mới
                                </button>
                            </div>
                            {loading ? <p>Đang tải...</p> : (
                                <>
                                    <h4>Món ăn bán chạy</h4>
                                    <div className="table-container">
                                        <table className="data-table">
                                            <thead><tr><th>Tên món</th><th>Danh mục</th><th>Số lần đặt</th><th>Tổng số lượng</th><th>Doanh thu</th></tr></thead>
                                            <tbody>
                                                {topFoods.map((f, i) => (
                                                    <tr key={i}>
                                                        <td>{f.TenMon}</td>
                                                        <td>{f.TenDanhMuc}</td>
                                                        <td>{f.SoLanDat}</td>
                                                        <td>{f.TongSoLuong}</td>
                                                        <td>{Number(f.TongDoanhThu).toLocaleString()}đ</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <h4 style={{ marginTop: '30px' }}>Top Shipper</h4>
                                    <div className="table-container">
                                        <table className="data-table">
                                            <thead><tr><th>Họ tên</th><th>Biển số xe</th><th>Tổng đơn</th><th>Đã giao</th><th>Đang giao</th></tr></thead>
                                            <tbody>
                                                {topShippers.map((s, i) => (
                                                    <tr key={i}>
                                                        <td>{s.HoTen}</td>
                                                        <td>{s.BienSoXe}</td>
                                                        <td>{s.TongDon}</td>
                                                        <td>{s.DonDaGiao}</td>
                                                        <td>{s.DonDangGiao}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </section>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {isOrderModalOpen && selectedOrder && (
                <div className="modal" onClick={() => setIsOrderModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-modal" onClick={() => setIsOrderModalOpen(false)}>&times;</span>
                        <h3>Chi tiết đơn hàng #{selectedOrder.MaDonHang}</h3>
                        <div className="order-detail-content">
                            <div className="detail-section">
                                <h4><i className="fa-solid fa-circle-info"></i> Thông tin</h4>
                                <div className="detail-row"><span className="detail-label">Khách hàng:</span><span className="detail-value">{selectedOrder.TenKhachHang}</span></div>
                                <div className="detail-row"><span className="detail-label">SĐT:</span><span className="detail-value">{selectedOrder.KhachHangSDT || '-'}</span></div>
                                <div className="detail-row"><span className="detail-label">Shipper:</span><span className="detail-value">{selectedOrder.TenShipper || 'Chưa có'}</span></div>
                                <div className="detail-row"><span className="detail-label">Địa chỉ:</span><span className="detail-value">{selectedOrder.DiaChiGiao}</span></div>
                                <div className="detail-row"><span className="detail-label">Trạng thái:</span><span className={`badge ${getStatusClass(selectedOrder.TrangThai)}`}>{getStatusLabel(selectedOrder.TrangThai)}</span></div>
                                <div className="detail-row"><span className="detail-label">Ngày đặt:</span><span className="detail-value">{new Date(selectedOrder.NgayDat).toLocaleString()}</span></div>
                            </div>
                            <div className="detail-section">
                                <h4><i className="fa-solid fa-credit-card"></i> Thanh toán</h4>
                                <div className="detail-row"><span className="detail-label">Phương thức:</span><span className="detail-value">{selectedOrder.PhuongThucThanhToan}</span></div>
                                <div className="detail-row"><span className="detail-label">Phí ship:</span><span className="detail-value">{Number(selectedOrder.PhiShip).toLocaleString()}đ</span></div>
                                <div className="detail-row"><span className="detail-label">Tổng tiền:</span><span className="detail-value"><strong>{Number(selectedOrder.TongTien).toLocaleString()}đ</strong></span></div>
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                <button className="btn-primary" onClick={() => setIsOrderModalOpen(false)}>Đóng</button>
                                {selectedOrder.TrangThai !== 'DaGiao' && selectedOrder.TrangThai !== 'Huy' && (
                                    <button className="btn-action btn-danger" onClick={() => handleCancelOrderAdmin(selectedOrder.MaDonHang)}>
                                        <i className="fa-solid fa-ban"></i> Hủy đơn
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Restaurant Edit Modal */}
            {isAddRestaurantModalOpen && (
                <div className="modal" onClick={() => setIsAddRestaurantModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-modal" onClick={() => setIsAddRestaurantModalOpen(false)}>&times;</span>
                        <h3>Chỉnh sửa nhà hàng</h3>
                        <form onSubmit={handleSaveRestaurant}>
                            <div className="form-group"><label>Tên nhà hàng:</label><input type="text" name="tenNhaHang" defaultValue={restaurant?.TenNhaHang} required /></div>
                            <div className="form-group"><label>Địa chỉ:</label><input type="text" name="diaChi" defaultValue={restaurant?.DiaChi} required /></div>
                            <div className="form-group"><label>Số điện thoại:</label><input type="text" name="soDienThoai" defaultValue={restaurant?.SoDienThoai} /></div>
                            <div className="form-group"><label>Link hình ảnh:</label><input type="text" name="hinhAnh" defaultValue={restaurant?.HinhAnh} /></div>
                            <div className="form-group"><label>Đơn tối thiểu (VNĐ):</label><input type="number" name="minOrder" defaultValue={restaurant?.MinOrder || 0} /></div>
                            <div className="form-group"><label>Mã code:</label><input type="text" name="maCode" defaultValue={restaurant?.MaCode} /></div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</button>
                                <button type="button" className="btn-secondary" onClick={() => setIsAddRestaurantModalOpen(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Food Modal */}
            {isFoodModalOpen && (
                <div className="modal" onClick={() => { setIsFoodModalOpen(false); setEditingFood(null); }}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-modal" onClick={() => { setIsFoodModalOpen(false); setEditingFood(null); }}>&times;</span>
                        <h3>{editingFood ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}</h3>
                        <form onSubmit={handleSaveFood}>
                            <div className="form-group"><label>Tên món:</label><input type="text" name="tenMon" defaultValue={editingFood?.TenMon} required /></div>
                            <div className="form-group"><label>Giá (VNĐ):</label><input type="number" name="gia" defaultValue={editingFood?.Gia} required /></div>
                            <div className="form-group"><label>Danh mục:</label>
                                <select name="maDanhMuc" defaultValue={editingFood?.MaDanhMuc || 1}>
                                    {categories.map(c => <option key={c.MaDanhMuc} value={c.MaDanhMuc}>{c.TenDanhMuc}</option>)}
                                </select>
                            </div>
                            <div className="form-group"><label>Số lượng tồn:</label><input type="number" name="soLuong" defaultValue={editingFood?.SoLuong || 100} required /></div>
                            <div className="form-group"><label>Mô tả:</label><textarea name="moTa" defaultValue={editingFood?.MoTa} rows={3} /></div>
                            <div className="form-group"><label>Link hình ảnh:</label><input type="text" name="hinhAnh" defaultValue={editingFood?.HinhAnh} /></div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</button>
                                <button type="button" className="btn-secondary" onClick={() => { setIsFoodModalOpen(false); setEditingFood(null); }}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {isCategoryModalOpen && (
                <div className="modal" onClick={() => setIsCategoryModalOpen(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <span className="close-modal" onClick={() => setIsCategoryModalOpen(false)}>&times;</span>
                        <h3>Thêm danh mục</h3>
                        <form onSubmit={handleSaveCategory}>
                            <input type="hidden" name="editId" value="" />
                            <div className="form-group"><label>Tên danh mục:</label><input type="text" name="tenDanhMuc" required placeholder="VD: Món Mặn" /></div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</button>
                                <button type="button" className="btn-secondary" onClick={() => setIsCategoryModalOpen(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
