import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axiosClient from '../utils/api';
import '../assets/css/sign_in.css';
import logo from '../images/Logo_icon.png';

const Register: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('khachhang');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (fullName === "" || username === "" || password === "" || confirmPassword === "") {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }

        try {
            // Gửi yêu cầu đăng ký lên API Backend
            const response = await axiosClient.post('/Auth/register', {
                Username: username,
                MatKhau: password,
                FullName: fullName,
                Role: accountType // 'khachhang', 'nhanvien', 'shipper'
            });

            if (response.data.resultCode > 0) {
                // Nếu là nhà hàng, khởi tạo thông tin nhà hàng ở localStorage (tuỳ chọn)
                if (accountType === "nhanvien") {
                    let restaurants = JSON.parse(localStorage.getItem('restaurants') || '[]');
                    const newRestaurant = {
                        id: 'rest_' + Date.now(),
                        name: fullName,
                        ownerUsername: username,
                        image: '/images/Logo_icon.png',
                        rating: 5.0,
                        products: []
                    };
                    restaurants.push(newRestaurant);
                    localStorage.setItem('restaurants', JSON.stringify(restaurants));
                }

                alert("Đăng ký thành công!");
                navigate('/login');
            } else {
                alert(response.data.message || "Đăng ký thất bại!");
            }
        } catch (error: any) {
            console.error("Lỗi đăng ký:", error);
            const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi kết nối tới server!";
            alert(errorMessage);
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
