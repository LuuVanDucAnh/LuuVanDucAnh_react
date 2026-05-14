import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authService } from '../services/apiService';
import '../assets/css/sign_in.css';
import logo from '../images/Logo_icon.png';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            alert("Vui lòng điền đầy đủ tên tài khoản và mật khẩu!");
            return;
        }

        if (username.length < 3) {
            alert("Tên tài khoản phải có ít nhất 3 ký tự!");
            return;
        }

        if (password.length < 5) {
            alert("Mật khẩu phải có ít nhất 5 ký tự!");
            return;
        }

        setLoading(true);

        try {
            const data = await authService.login({ username, password });

            localStorage.setItem("token", data.token);
            localStorage.setItem("currentUser", JSON.stringify(data.user));
            localStorage.setItem("loginTime", new Date().toISOString());

            const vaiTro = data.user.vaiTro;

            if (vaiTro === "Admin") {
                window.location.href = "/admin";
            } else if (vaiTro === "NhanVien") {
                window.location.href = "/restaurant-admin";
            } else if (vaiTro === "Shipper") {
                window.location.href = "/shipper";
            } else {
                window.location.href = "/";
            }
        } catch (error: any) {
            console.error("Lỗi khi đăng nhập:", error);
            const message = error.response?.data?.message || "Có lỗi xảy ra khi đăng nhập!";
            alert(message);
        } finally {
            setLoading(false);
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
                            <button type="submit" id="login_btn" disabled={loading}>
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </button>
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
