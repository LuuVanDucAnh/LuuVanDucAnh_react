import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/sign_in.css';
import logo from '../images/Logo_icon.png';

const Register: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('khachhang');

    const navigate = useNavigate();

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (fullName === "" || username === "" || password === "" || confirmPassword === "") {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (fullName.length < 2) {
            alert("Họ và tên phải có ít nhất 2 ký tự!");
            return;
        }

        if (username.length < 3) {
            alert("Tên tài khoản phải có ít nhất 3 ký tự!");
            return;
        }

        if (password.length < 6) {
            alert("Mật khẩu phải có ít nhất 6 ký tự!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp! Vui lòng nhập lại.");
            return;
        }

        let users: any[] = [];
        try {
            const usersData = localStorage.getItem("users");
            if (usersData) users = JSON.parse(usersData);
        } catch (error) {
            console.error("Lỗi khi đọc dữ liệu:", error);
            alert("Có lỗi xảy ra! Vui lòng thử lại.");
            return;
        }

        const userExists = users.some((user: any) => user.username === username);
        if (userExists) {
            alert("Tài khoản đã tồn tại! Vui lòng chọn tên tài khoản khác.");
            return;
        }

        let role = accountType;
        if (username.toLowerCase() === "admin") {
            role = "admin";
        }

        const newUser: any = {
            fullname: fullName,
            username: username,
            password: password,
            createdAt: new Date().toISOString(),
            role: role
        };

        if (role === "nhanvien" || role === "Nhà hàng") {
            const restaurantId = 'rest_' + Date.now();
            newUser.restaurantId = restaurantId;
            
            let restaurants: any[] = [];
            try {
                const restaurantsData = localStorage.getItem('restaurants');
                if (restaurantsData) restaurants = JSON.parse(restaurantsData);
            } catch (error) {}
            
            const existingRestaurant = restaurants.find(r => r.id === restaurantId);
            if (!existingRestaurant) {
                const newRestaurant = {
                    id: restaurantId,
                    name: fullName || username + ' Restaurant',
                    description: 'Nhà hàng của ' + fullName,
                    image: '/images/Logo_icon.png',
                    address: 'Chưa cập nhật',
                    phone: 'Chưa cập nhật',
                    rating: 5.0,
                    deliveryTime: '30-45 phút',
                    minOrder: 50000,
                    ownerUsername: username,
                    products: []
                };
                restaurants.push(newRestaurant);
                localStorage.setItem('restaurants', JSON.stringify(restaurants));
                console.log('Đã tạo nhà hàng mới:', restaurantId);
            }
        }

        users.push(newUser);

        try {
            localStorage.setItem("users", JSON.stringify(users));
            alert("Đăng ký thành công!");
            navigate('/login');
        } catch (error) {
            console.error("Lỗi khi lưu dữ liệu:", error);
            alert("Có lỗi xảy ra! Vui lòng thử lại.");
        }
    };

    return (
        <>
            <Header />
            <div className="main main_sign">
                <div className="container container_sign">
                    <div className="logo_sign">
                        <img src={logo} alt="Logo DA FOOD" />
                    </div>
                    <div className="sign">
                        <h2>Đăng ký tài khoản</h2>
                        <form className="infor_account" onSubmit={handleRegister}>
                            <input 
                                autoComplete="off" 
                                type="text" 
                                id="fullname" 
                                placeholder="Nhập họ và tên" 
                                required 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <br />
                            <input 
                                autoComplete="off" 
                                type="text" 
                                id="tk" 
                                placeholder="Nhập tên tài khoản" 
                                required 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <br />
                            <input 
                                autoComplete="off" 
                                type="password" 
                                id="mk" 
                                placeholder="Nhập mật khẩu" 
                                required 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <br />
                            <input 
                                autoComplete="off" 
                                type="password" 
                                id="mk2" 
                                placeholder="Nhập lại mật khẩu" 
                                required 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <br />
                            
                            <div className="account-type-selection">
                                <label className="account-type-label">Chọn loại tài khoản:</label>
                                <div className="account-type-options">
                                    <label className="account-type-option">
                                        <input 
                                            type="radio" 
                                            name="accountType" 
                                            value="khachhang" 
                                            checked={accountType === 'khachhang'}
                                            onChange={(e) => setAccountType(e.target.value)}
                                        />
                                        <div className="option-card">
                                            <i className="fa-solid fa-user"></i>
                                            <span>Khách hàng</span>
                                        </div>
                                    </label>
                                    <label className="account-type-option">
                                        <input 
                                            type="radio" 
                                            name="accountType" 
                                            value="nhanvien"
                                            checked={accountType === 'nhanvien'}
                                            onChange={(e) => setAccountType(e.target.value)}
                                        />
                                        <div className="option-card">
                                            <i className="fa-solid fa-utensils"></i>
                                            <span>Nhà hàng</span>
                                        </div>
                                    </label>
                                    <label className="account-type-option">
                                        <input 
                                            type="radio" 
                                            name="accountType" 
                                            value="shipper"
                                            checked={accountType === 'shipper'}
                                            onChange={(e) => setAccountType(e.target.value)}
                                        />
                                        <div className="option-card">
                                            <i className="fa-solid fa-truck"></i>
                                            <span>Shipper</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <br />

                            <button type="submit">Đăng ký</button>
                            <br />
                            <span>Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link></span>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;
