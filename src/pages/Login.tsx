import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../assets/css/sign_in.css';
import logo from '../images/Logo_icon.png';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Đăng nhập với:', { username, password });
        // Xử lý logic đăng nhập tại đây
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
