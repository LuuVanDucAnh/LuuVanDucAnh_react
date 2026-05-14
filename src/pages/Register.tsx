import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { authService } from '../services/apiService';
import '../assets/css/sign_in.css';
import logo from '../images/Logo_icon.png';

const Register: React.FC = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [accountType, setAccountType] = useState('khachhang');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }

        if (password.length < 5) {
            alert("Mật khẩu phải có ít nhất 5 ký tự!");
            return;
        }

        setLoading(true);

        try {
            await authService.register({
                username,
                password,
                hoTen: fullName,
                soDienThoai: phone,
                diaChi: '',
            });

            alert("Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login');
        } catch (error: any) {
            console.error("Lỗi đăng ký:", error);
            const message = error.response?.data?.message || "Có lỗi xảy ra khi đăng ký!";
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
                    <div className="sign" style={{ width: '400px' }}>
                        <h2>Đăng ký tài khoản</h2>
                        <form className="infor_account" onSubmit={handleRegister}>
                            <input type="text" placeholder="Họ và tên" required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="off" />
                            <input type="text" placeholder="Tên đăng nhập" required value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
                            <input type="tel" placeholder="Số điện thoại" required value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="off" />
                            <input type="password" placeholder="Mật khẩu (ít nhất 5 ký tự)" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                            <input type="password" placeholder="Nhập lại mật khẩu" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" />

                            <div className="account-type-selection">
                                <label className="account-type-label">Chọn vai trò:</label>
                                <div className="account-type-options">
                                    <label className="account-type-option">
                                        <input type="radio" name="accountType" value="khachhang" checked={accountType === 'khachhang'} onChange={(e) => setAccountType(e.target.value)} />
                                        <div className="option-card">
                                            <i className="fa-solid fa-user"></i>
                                            <span>Khách hàng</span>
                                        </div>
                                    </label>
                                    <label className="account-type-option">
                                        <input type="radio" name="accountType" value="nhanvien" checked={accountType === 'nhanvien'} onChange={(e) => setAccountType(e.target.value)} />
                                        <div className="option-card">
                                            <i className="fa-solid fa-utensils"></i>
                                            <span>Nhà hàng</span>
                                        </div>
                                    </label>
                                    <label className="account-type-option">
                                        <input type="radio" name="accountType" value="shipper" checked={accountType === 'shipper'} onChange={(e) => setAccountType(e.target.value)} />
                                        <div className="option-card">
                                            <i className="fa-solid fa-truck"></i>
                                            <span>Shipper</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {accountType === 'shipper' && (
                                <input type="text" placeholder="Biển số xe" required value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
                            )}
                            <button type="submit" style={{ marginTop: '10px' }} disabled={loading}>
                                {loading ? "Đang đăng ký..." : "Đăng ký ngay"}
                            </button>
                            <div style={{ marginTop: '15px' }}>
                                <span>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></span>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Register;
