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

        try {
            const response = await axiosClient.post('/Auth/login', {
                username: username,
                password: password
            });

            // API của bạn trả về thông qua ApiResponse.Ok(responseData, message)
            // Cấu trúc trả về thường sẽ nằm trong response.data.data (nếu ApiResponse có thuộc tính data)
            // hoặc tuỳ thuộc vào cách định nghĩa class ApiResponse của bạn.
            // Dưới đây giả định ApiResponse bọc dữ liệu trong thuộc tính 'data'
            
            const apiResponse = response.data;
            const responseData = apiResponse.data || apiResponse; // Đề phòng trường hợp API trả trực tiếp

            if (responseData && responseData.token) {
                // Lưu thông tin người dùng và token
                localStorage.setItem("token", responseData.token);
                localStorage.setItem("currentUser", JSON.stringify(responseData.user));
                localStorage.setItem("loginTime", new Date().toISOString());

                let redirectUrl = "/";
                const role = responseData.user?.role?.toLowerCase() || "";
                
                if (role === "admin") {
                    redirectUrl = "/admin";
                } else if (role === "nhanvien" || role === "nhà hàng") {
                    redirectUrl = "/nhahang";
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
                alert("Có lỗi xảy ra kết nối với Server! Vui lòng thử lại.");
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
