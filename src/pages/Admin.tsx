import React, { useState, useEffect } from 'react';
import axiosClient from "../utils/api";
import '../assets/css/admin.css';
import LogoIcon from '../images/Logo_icon.png';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAddRestaurantModalOpen, setIsAddRestaurantModalOpen] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [cartCount, setCartCount] = useState(0);

    // State for dynamic data
    const [users, setUsers] = useState<any[]>([]);
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = localStorage.getItem("currentUser");
        if (user) {
            setCurrentUser(JSON.parse(user));
        }

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);

        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            // Lấy danh sách người dùng
            const userRes = await axiosClient.get('/account/all');
            if (userRes.data.success) setUsers(userRes.data.data);

            // Lấy danh sách nhà hàng
            const resRes = await axiosClient.get('/foods/Food/GetAll-NhaHang');
            setRestaurants(resRes.data);

            // Lấy danh sách đơn hàng
            const orderRes = await axiosClient.get('/orders/ManageOrder/admin/all');
            if (orderRes.data.success) setOrders(orderRes.data.data);

            // Lấy thống kê
            const statsRes = await axiosClient.get('/orders/ManageOrder/stats');
            if (statsRes.data.success) setStatsData(statsRes.data.data);

        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu Admin:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.removeItem("currentUser");
            localStorage.removeItem("token");
            window.location.href = "/";
        }
    };

    const handleOrderDetails = (order: any) => {
        setSelectedOrder(order);
        setIsOrderModalOpen(true);
    };

    return (
        <div className="admin-page-wrapper">
            <div className="admin-header">
                <div className="header_top">
                    <div className="admin-container">
                        <div className="header_top_left">
                            <div className="header_logo">
                                <Link to="/"><img className="Logo_icon" src={LogoIcon} alt="Logo" /></Link>
                            </div>
                        </div>
                        <div className="header_top_middle">
                            <form action="" className="form_search">
                                <span className="search_btn">
                                    <i className="fa-solid fa-magnifying-glass"></i>
                                </span>
                                <input autoComplete="off" type="text" placeholder="Tìm kiếm..." />
                                <button type="button">
                                    <i className="fa-solid fa-filter"></i> Lọc
                                </button>
                            </form>
                        </div>
                        <div className="header_top_right">
                            <ul className="header_list">
                                <li className="account">
                                    <i className="fa-solid fa-user"></i>
                                    <div className="text">
                                        {currentUser ? (
                                            <span className="text_tk" style={{ display: 'block' }}>{currentUser.fullname || currentUser.username} <i className="fa-solid fa-caret-down"></i></span>
                                        ) : (
                                            <span className="text_dndk">Đăng nhập</span>
                                        )}
                                    </div>
                                    <ul className="account_manager">
                                        {currentUser ? (
                                            <>
                                                <li className="yes_acc" style={{ display: 'block' }}><Link to="/admin"><i className="fa-solid fa-gear"></i> Quản lý</Link></li>
                                                <li className="yes_acc" style={{ display: 'block' }} onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất</li>
                                            </>
                                        ) : (
                                            <li className="no_acc" style={{ display: 'block' }}><Link to="/login"><i className="fa-solid fa-right-to-bracket"></i> Đăng nhập</Link></li>
                                        )}
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

            <div className="admin-main">
                <div className="main_left">
                    <nav className="menu">
                        <div className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                            <i className="fa-solid fa-chart-line"></i>
                            <span>Dashboard</span>
                        </div>

                        <div className={`menu-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
                            <i className="fa-solid fa-users"></i>
                            <span>Quản lý người dùng</span>
                        </div>

                        <div className={`menu-item ${activeTab === 'restaurants' ? 'active' : ''}`} onClick={() => setActiveTab('restaurants')}>
                            <i className="fa-solid fa-store"></i>
                            <span>Quản lý nhà hàng</span>
                        </div>

                        <div className={`menu-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
                            <i className="fa-solid fa-clipboard-list"></i>
                            <span>Quản lý đơn hàng</span>
                        </div>

                        <div className={`menu-item ${activeTab === 'statistics' ? 'active' : ''}`} onClick={() => setActiveTab('statistics')}>
                            <i className="fa-solid fa-chart-pie"></i>
                            <span>Thống kê</span>
                        </div>
                    </nav>
                </div>

                <div className="main_right">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <section className="tab-content" id="dashboard">
                            <div className="welcome">
                                <h3>Chào mừng, System Administrator</h3>
                                <p>Tổng quan về hệ thống quản lý giao đồ ăn</p>
                            </div>

                            <div className="stats">
                                <div className="card">
                                    <i className="fa-solid fa-users"></i>
                                    <span>{statsData?.totalUsers || 0}</span>
                                    <p>Tổng người dùng</p>
                                </div>
                                <div className="card">
                                    <i className="fa-solid fa-store"></i>
                                    <span>{statsData?.totalRestaurants || 0}</span>
                                    <p>Tổng nhà hàng</p>
                                </div>
                                <div className="card">
                                    <i className="fa-solid fa-clipboard-list"></i>
                                    <span>{statsData?.totalOrders || 0}</span>
                                    <p>Tổng đơn hàng</p>
                                </div>
                                <div className="card">
                                    <i className="fa-solid fa-money-bill-wave"></i>
                                    <span>{(statsData?.totalRevenue || 0).toLocaleString()} VNĐ</span>
                                    <p>Tổng doanh thu</p>
                                </div>
                            </div>

                            <div className="stats-grid">
                                <div className="card">
                                    <i className="fa-solid fa-check-circle"></i>
                                    <span>{statsData?.completedOrders || 0}</span>
                                    <p>Đơn đã hoàn thành</p>
                                </div>
                                <div className="card">
                                    <i className="fa-solid fa-clock"></i>
                                    <span>{statsData?.pendingOrders || 0}</span>
                                    <p>Đơn đang chờ</p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Users Management Tab */}
                    {activeTab === 'users' && (
                        <section className="tab-content" id="users">
                            <div className="section-header">
                                <h3>Quản lý người dùng</h3>
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
                                        {users.map(user => (
                                            <tr key={user.maTK}>
                                                <td>{user.maTK}</td>
                                                <td>{user.hoTen}</td>
                                                <td>{user.username}</td>
                                                <td><span className={`badge badge-${user.vaiTro?.toLowerCase()}`}>{user.vaiTro}</span></td>
                                                <td>{user.soDienThoai}</td>
                                                <td>
                                                    <button className="btn-action btn-primary"><i className="fa-solid fa-pen"></i></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Restaurants Management Tab */}
                    {activeTab === 'restaurants' && (
                        <section className="tab-content" id="restaurants">
                            <div className="section-header">
                                <h3>Quản lý nhà hàng</h3>
                                <button className="btn-primary" onClick={() => setIsAddRestaurantModalOpen(true)}>
                                    <i className="fa-solid fa-plus"></i> Thêm nhà hàng
                                </button>
                            </div>
                            <div className="restaurants-grid">
                                {restaurants.map(res => (
                                    <div className="restaurant-card-admin" key={res.maNhaHang}>
                                        <div className="restaurant-card-image">
                                            <img src={res.hinhAnh?.startsWith('http') ? res.hinhAnh : require(`../images/anh-chung.jpg`)} alt={res.tenNhaHang} />
                                        </div>
                                        <div className="restaurant-card-info">
                                            <h4>{res.tenNhaHang}</h4>
                                            <p>{res.diaChi}</p>
                                            <div className="restaurant-card-details">
                                                <div><i className="fa-solid fa-phone"></i> {res.soDienThoai}</div>
                                                <div><i className="fa-solid fa-money-bill"></i> Min: {res.minOrder?.toLocaleString()}đ</div>
                                            </div>
                                            <div className="restaurant-card-actions">
                                                <button className="btn-action btn-primary">Sửa</button>
                                                <button className="btn-action btn-danger">Xóa</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Orders Management Tab */}
                    {activeTab === 'orders' && (
                        <section className="tab-content" id="orders">
                            <div className="section-header">
                                <h3>Quản lý đơn hàng</h3>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Mã đơn</th>
                                            <th>Địa chỉ giao</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày đặt</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.maDonHang}>
                                                <td>{order.maDonHang}</td>
                                                <td>{order.diaChiGiao}</td>
                                                <td>{order.tongTien?.toLocaleString()} VNĐ</td>
                                                <td><span className={`badge badge-${order.trangThai?.toLowerCase()}`}>{order.trangThai}</span></td>
                                                <td>{new Date(order.ngayDat).toLocaleDateString()}</td>
                                                <td>
                                                    <button className="btn-action btn-primary" onClick={() => handleOrderDetails(order)}>
                                                        <i className="fa-solid fa-eye"></i> Chi tiết
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}

                    {/* Statistics Tab */}
                    {activeTab === 'statistics' && (
                        <section className="tab-content" id="statistics">
                            <div className="section-header">
                                <h3>Thống kê và báo cáo</h3>
                            </div>
                            <div className="stats-grid-large">
                                <div className="stat-card-large">
                                    <h4>Doanh thu theo tháng</h4>
                                    <div className="stat-row"><span>Tháng 1</span><strong>150.000.000 VNĐ</strong></div>
                                    <div className="stat-row"><span>Tháng 2</span><strong>180.000.000 VNĐ</strong></div>
                                    <div className="stat-row"><span>Tháng 3</span><strong>210.000.000 VNĐ</strong></div>
                                    <div className="stat-row"><span>Tháng 4</span><strong>250.000.000 VNĐ</strong></div>
                                </div>
                                <div className="stat-card-large">
                                    <h4>Đơn hàng theo trạng thái</h4>
                                    <div className="stat-row"><span>Hoàn thành</span><strong>3150</strong></div>
                                    <div className="stat-row"><span>Đang giao</span><strong>80</strong></div>
                                    <div className="stat-row"><span>Đã hủy</span><strong>50</strong></div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {isOrderModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-modal" onClick={() => setIsOrderModalOpen(false)}>&times;</span>
                        <h3>Chi tiết đơn hàng {selectedOrder?.id}</h3>
                        <div id="order-detail-content">
                            <div className="order-detail-item"><strong>Khách hàng:</strong> {selectedOrder?.customer}</div>
                            <div className="order-detail-item"><strong>Nhà hàng:</strong> {selectedOrder?.restaurant}</div>
                            <div className="order-detail-item"><strong>Trạng thái:</strong> {selectedOrder?.status}</div>
                            <div className="order-detail-item"><strong>Tổng cộng:</strong> {selectedOrder?.total.toLocaleString()} VNĐ</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Restaurant Modal */}
            {isAddRestaurantModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close-modal" onClick={() => setIsAddRestaurantModalOpen(false)}>&times;</span>
                        <h3>Thêm nhà hàng mới</h3>
                        <form onSubmit={(e) => { e.preventDefault(); setIsAddRestaurantModalOpen(false); }}>
                            <div className="form-group">
                                <label>Tên nhà hàng:</label>
                                <input type="text" required />
                            </div>
                            <div className="form-group">
                                <label>Mô tả:</label>
                                <textarea rows={3}></textarea>
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ:</label>
                                <input type="text" required />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại:</label>
                                <input type="text" required />
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary">Thêm nhà hàng</button>
                                <button type="button" className="btn-secondary" onClick={() => setIsAddRestaurantModalOpen(false)}>Hủy</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
