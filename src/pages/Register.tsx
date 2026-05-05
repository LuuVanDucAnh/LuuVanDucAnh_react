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
    const [phone, setPhone] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [accountType, setAccountType] = useState('khachhang');

    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp!");
            return;
        }

        // Map role string to enum value expected by Backend
        // KhachHang = 1, NhanVien = 2, Shipper = 3
        let roleValue = 1;
        if (accountType === 'nhanvien') roleValue = 2;
        if (accountType === 'shipper') roleValue = 3;

        const payload = {
            Username: username,
            Password: password,
            VaiTro: roleValue,
            HoTen: fullName,
            SoDienThoai: phone,
            DiaChi: null, // Bỏ nhập địa chỉ theo yêu cầu
            BienSoXe: accountType === 'shipper' ? licensePlate : null,
            MaCode: null // Xóa mã code nhà hàng theo yêu cầu
        };

        try {
            const response = await axiosClient.post('/auth/register', payload);

            if (response.data.resultCode > 0) {
                alert("Đăng ký thành công!");
                navigate('/login');
            } else {
                alert(response.data.message || "Đăng ký thất bại!");
            }
        } catch (error: any) {
            console.error("Lỗi đăng ký:", error);
            const errorMessage = error.response?.data?.message || 
                               (error.response?.data?.errors ? "Dữ liệu không hợp lệ (kiểm tra SĐT hoặc mã code)" : "Không thể kết nối tới Server!");
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
                    <div className="sign" style={{ width: '400px' }}>
                        <h2>Đăng ký tài khoản</h2>
                        <form className="infor_account" onSubmit={handleRegister}>
                            <input type="text" placeholder="Họ và tên" required value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="off" />
                            <input type="text" placeholder="Tên đăng nhập" required value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
                            <input type="tel" placeholder="Số điện thoại (10 số, bắt đầu bằng 0)" required value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="off" />
                            <input type="password" placeholder="Mật khẩu" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
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

                            {/* Trường nhập thêm dựa trên vai trò */}
                            {accountType === 'shipper' && (
                                <input type="text" placeholder="Biển số xe" required value={licensePlate} onChange={(e) => setLicensePlate(e.target.value)} />
                            )}
                            <button type="submit" style={{ marginTop: '10px' }}>Đăng ký ngay</button>
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
