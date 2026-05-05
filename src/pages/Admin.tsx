import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        const user = localStorage.getItem("currentUser");
        if (user) {
            setCurrentUser(JSON.parse(user));
        }

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
        setCartCount(count);
    }, []);

    const handleLogout = () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            localStorage.removeItem("currentUser");
            window.location.href = "/";
        }
    };

    // Mock data for demonstration
    const stats = {
        totalUsers: 1250,
        totalRestaurants: 45,
        totalOrders: 3280,
        totalRevenue: '1.250.000.000 VNĐ',
        customers: 1100,
        restaurantStaff: 120,
        shippers: 30,
        completedOrders: 3150
    };

    const bestSellers = [
        { id: 1, name: 'Bánh tráng trộn', sales: 150, image: 'Banh-trang-tron.jpg' },
        { id: 2, name: 'Trà sữa trân châu', sales: 120, image: 'Tra-sua-tran-chau-duong-den.jpg' },
        { id: 3, name: 'Cơm chiên hải sản', sales: 95, image: 'Com-chien-chay.png' }
    ];

    const topRestaurants = [
        { id: 1, name: 'Nhà hàng Sen Vàng', rating: 4.8, orders: 450 },
        { id: 2, name: 'Phở Lý Quốc Sư', rating: 4.7, orders: 380 },
        { id: 3, name: 'Bún Chả Sinh Từ', rating: 4.6, orders: 320 }
    ];

    const users = [
        { id: 'USR001', name: 'Nguyễn Văn A', username: 'vana123', role: 'customer', createdAt: '2024-01-15' },
        { id: 'USR002', name: 'Trần Thị B', username: 'thib_staff', role: 'nhanvien', createdAt: '2024-02-10' },
        { id: 'USR003', name: 'Lê Văn C', username: 'vanc_shipper', role: 'shipper', createdAt: '2024-03-05' },
        { id: 'USR004', name: 'Phạm Minh D', username: 'admin_minh', role: 'admin', createdAt: '2023-12-20' },
    ];

    const restaurants = [
        { id: 1, name: 'Nhà hàng Sen Vàng', description: 'Chuyên các món ăn truyền thống Việt Nam', address: '123 Nguyễn Huệ, Quận 1', phone: '0901234567', image: 'anh-chung.jpg', minOrder: 50000 },
        { id: 2, name: 'Phở Lý Quốc Sư', description: 'Phở gia truyền nổi tiếng Hà Nội', address: '45 Lý Quốc Sư, Hoàn Kiếm', phone: '0987654321', image: 'Lau-thai.jpg', minOrder: 30000 },
    ];

    const orders = [
        { id: 'ORD001', customer: 'Nguyễn Văn A', restaurant: 'Nhà hàng Sen Vàng', total: 150000, status: 'completed', date: '2024-05-01' },
        { id: 'ORD002', customer: 'Trần Thị B', restaurant: 'Phở Lý Quốc Sư', total: 85000, status: 'preparing', date: '2024-05-05' },
        { id: 'ORD003', customer: 'Lê Văn C', restaurant: 'Bún Chả Sinh Từ', total: 120000, status: 'new', date: '2024-05-05' },
    ];

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
                                    <span>{stats.totalUsers}</span>
                                    <p>Tổng người dùng</p>
                                </div>
                                <div className="card">
                                    <i className="fa-solid fa-store"></i>
                                    <span>{stats.totalRestaurants}</span>
                                    <p>Tổng nhà hàng</p>
                                </div>
                                <div className="card">
                                    <i className="fa-solid fa-clipboard-list"></i>
                                    <span>{stats.totalOrders}</span>
                                    <p>Tổng đơn hàng</p>
                                </div>
                                <div className="card">
                                    <i className="fa-solid fa-money-bill-wave"></i>
                                    <span>{stats.totalRevenue}</span>
                                    <p>Tổng doanh thu</p>
                                </div>
                            </div>

                            <div className="stats-grid">
                                <div className="card">
                                    <i className="fa-solid fa-user-tie"></i>
                                    <span>{stats.customers}</span>
                                    <p>Khách hàng</p>
                                </div>
                                <div className="card">
                                    <i className="fa-solid fa-utensils"></i>
                                    <span>{stats.restaurantStaff}</span>
                                    <p>Nhân viên nhà hàng</p>
                                </div>
                                <div className="card">
                                    <i className="fa-solid fa-motorcycle"></i>
                                    <span>{stats.shippers}</span>
                                    <p>Shipper</p>
                                </div>
                                <div className="card">
                                    <i className="fa-solid fa-check-circle"></i>
                                    <span>{stats.completedOrders}</span>
                                    <p>Đơn đã hoàn thành</p>
                                </div>
                            </div>

                            <div className="content">
                                <div className="box">
                                    <h4><i className="fa-solid fa-fire"></i> Món ăn bán chạy</h4>
                                    <ul>
                                        {bestSellers.map(item => (
                                            <li key={item.id}>
                                                <img src={require(`../images/${item.image}`)} alt={item.name} />
                                                <div>
                                                    <strong>{item.name}</strong>
                                                    <span>Đã bán: {item.sales}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="box">
                                    <h4><i className="fa-solid fa-chart-line"></i> Nhà hàng hoạt động tốt</h4>
                                    <ul>
                                        {topRestaurants.map(res => (
                                            <li key={res.id}>
                                                <div>
                                                    <strong>{res.name}</strong>
                                                    <span>Đánh giá: {res.rating} ⭐ | Đơn hàng: {res.orders}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Users Management Tab */}
                    {activeTab === 'users' && (
                        <section className="tab-content" id="users">
                            <div className="section-header">
                                <h3>Quản lý người dùng</h3>
                                <div className="filter-tabs">
                                    <button className="filter-btn active">Tất cả</button>
                                    <button className="filter-btn">Khách hàng</button>
                                    <button className="filter-btn">Nhà hàng</button>
                                    <button className="filter-btn">Shipper</button>
                                </div>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Họ tên</th>
                                            <th>Username</th>
                                            <th>Vai trò</th>
                                            <th>Ngày tạo</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.username}</td>
                                                <td><span className={`badge badge-${user.role}`}>{user.role}</span></td>
                                                <td>{user.createdAt}</td>
                                                <td>
                                                    <button className="btn-action btn-primary"><i className="fa-solid fa-pen"></i></button>
                                                    <button className="btn-action btn-danger"><i className="fa-solid fa-trash"></i></button>
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
                                    <div className="restaurant-card-admin" key={res.id}>
                                        <div className="restaurant-card-image">
                                            <img src={require(`../images/${res.image}`)} alt={res.name} />
                                        </div>
                                        <div className="restaurant-card-info">
                                            <h4>{res.name}</h4>
                                            <p>{res.description}</p>
                                            <div className="restaurant-card-details">
                                                <div><i className="fa-solid fa-location-dot"></i> {res.address}</div>
                                            </div>
                                            <div className="restaurant-card-details">
                                                <div><i className="fa-solid fa-phone"></i> {res.phone}</div>
                                                <div><i className="fa-solid fa-money-bill"></i> Min: {res.minOrder.toLocaleString()}đ</div>
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
                                <div className="filter-tabs">
                                    <button className="filter-btn active">Tất cả</button>
                                    <button className="filter-btn">Đơn mới</button>
                                    <button className="filter-btn">Hoàn thành</button>
                                </div>
                            </div>
                            <div className="table-container">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Mã đơn</th>
                                            <th>Khách hàng</th>
                                            <th>Nhà hàng</th>
                                            <th>Tổng tiền</th>
                                            <th>Trạng thái</th>
                                            <th>Ngày tạo</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.customer}</td>
                                                <td>{order.restaurant}</td>
                                                <td>{order.total.toLocaleString()} VNĐ</td>
                                                <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                                                <td>{order.date}</td>
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
