import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import axiosClient from '../utils/api';
import '../assets/css/sign_in.css';
import logo from '../images/Logo_icon.png';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (username === '' || password === '') {
            alert("Vui lòng điền đầy đủ tên tài khoản và mật khẩu!");
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

        // --- CHẾ ĐỘ MOCK LOGIN (ĐỂ TEST GIAO DIỆN) ---
        const mockUsers: any = {
            'admin': { token: 'mock-token-admin', user: { username: 'admin', fullname: 'System Admin', role: 'admin' } },
            'shipper': { token: 'mock-token-shipper', user: { username: 'shipper', fullname: 'Shipper Test', role: 'shipper' } },
            'nhahang': { token: 'mock-token-nhahang', user: { username: 'nhahang', fullname: 'Restaurant Staff', role: 'nhanvien' } }
        };

        if (mockUsers[username] && password === username + '123') {
            const data = mockUsers[username];
            localStorage.setItem("token", data.token);
            localStorage.setItem("currentUser", JSON.stringify(data.user));
            localStorage.setItem("loginTime", new Date().toISOString());
            
            alert("Đăng nhập Mock thành công (Chế độ test)!");
            window.location.href = username === 'admin' ? '/admin' : (username === 'shipper' ? '/shipper' : '/restaurant-admin');
            return;
        }
        // ------------------------------------------

        try {
            const response = await axiosClient.post('/Auth/login', {
                Username: username,
                MatKhau: password
            });

            const apiResponse = response.data;
            const responseData = apiResponse.data || apiResponse; 

            if (responseData && responseData.token) {
                localStorage.setItem("token", responseData.token);
                localStorage.setItem("currentUser", JSON.stringify(responseData.user));
                localStorage.setItem("loginTime", new Date().toISOString());

                let redirectUrl = "/";
                const role = responseData.user?.role?.toLowerCase() || "";
                
                if (role === "admin") {
                    redirectUrl = "/admin";
                } else if (role === "nhanvien" || role === "nhà hàng" || role === "nhahang") {
                    redirectUrl = "/restaurant-admin";
                } else if (role === "shipper") {
                    redirectUrl = "/shipper";
                }

                alert(apiResponse.message || "Đăng nhập thành công!");
                window.location.href = redirectUrl;
            } else {
                alert("Không lấy được token từ server!");
            }
        } catch (error: any) {
            console.error("Lỗi khi đăng nhập:", error);
            if (error.response && error.response.status === 400) {
                alert(error.response.data?.message || "Sai tài khoản hoặc mật khẩu!");
            } else {
                alert("Có lỗi xảy ra kết nối với Server! Vui lòng thử lại. (Sử dụng admin/admin123 để test)");
            }
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
                        <h2>Đăng nhập</h2>
                        <form className="infor_account" onSubmit={handleLogin}>
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
                            <div className="login-help">
                                <Link to="#" className="forgot-password">Quên mật khẩu?</Link>
                            </div>
                            <br />
                            <button type="submit" id="login_btn">Đăng nhập</button>
                            <br />
                            <span>Bạn mới biết đến DA FOOD? <Link to="/register">Đăng ký</Link></span>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
