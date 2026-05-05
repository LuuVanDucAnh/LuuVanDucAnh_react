import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/sign_in.css';
import logo from '../images/Logo_icon.png';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
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

        const usersData = localStorage.getItem("users");
        if (!usersData) {
            alert("Không có dữ liệu người dùng! Vui lòng đăng ký tài khoản mới.");
            return;
        }

        try {
            const users = JSON.parse(usersData);
            const foundUser = users.find((user: any) => user.username === username && user.password === password);

            if (foundUser) {
                localStorage.setItem("currentUser", JSON.stringify(foundUser));
                localStorage.setItem("loginTime", new Date().toISOString());

                let redirectUrl = "/";
                if (foundUser.role === "admin" || foundUser.role === "Admin") {
                    redirectUrl = "/admin";
                } else if (foundUser.role === "nhanvien" || foundUser.role === "Nhân Viên") {
                    redirectUrl = "/nhahang";
                } else if (foundUser.role === "shipper" || foundUser.role === "Shipper") {
                    redirectUrl = "/shipper";
                }

                alert("Đăng nhập thành công!");
                window.location.href = redirectUrl;
            } else {
                alert("Sai tài khoản hoặc mật khẩu!");
            }
        } catch (error) {
            console.error("Lỗi khi đọc dữ liệu:", error);
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
