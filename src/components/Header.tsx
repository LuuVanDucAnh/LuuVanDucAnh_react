import { Link } from "react-router-dom";
import logo from "../images/Logo_icon.png";
import "../assets/css/Header.css";

const Header = () => {
  return (
    <div className="header">
      <div className="header_top">
        <div className="container">

          {/* LOGO */}
          <div className="header_top_left">
            <div className="header_logo">
              <Link to="/">
                <img className="Logo_icon" src={logo} alt="logo" />
              </Link>
            </div>
          </div>

          {/* SEARCH */}
          

          <div className="header_top_middle">
            <form className="form_search">
              <span className="search_btn">
                <i className="fa-solid fa-magnifying-glass"></i>
              </span>

              <input type="text" placeholder="Tìm kiếm món ăn" />

              <button type="submit">
                <i className="fa-solid fa-filter"></i> Lọc
              </button>
            </form>
          </div>

          {/* ACCOUNT + CART */}
          <div className="header_top_right">
            <ul className="header_list">

              <li className="account">
                <i className="fa-solid fa-user"></i>
                <div className="text">
                  <span id="text_dndk" className="text_dndk">Đăng nhập / Đăng ký</span>
                  <span id="text_tk" className="text_tk">Tài khoản<i className="fa-solid fa-caret-down"></i></span>
                </div>
                <ul className="account_manager">
                  <li className="no_acc"><Link to="/login"><i className="fa-solid fa-right-to-bracket"></i> Đăng nhập</Link></li>
                  <li className="no_acc"><Link to="/register"><i className="fa-solid fa-user-plus"></i> Đăng ký</Link></li>
                  <li id="admin" className="yes_acc"><Link to="/admin"><i className="fa-solid fa-gear"></i> Quản lý cửa hàng</Link></li>
                  <li id="nhanvien" className="yes_acc"><Link to="/nhahang"><i className="fa-solid fa-gear"></i> Quản lý nhà hàng</Link></li>
                  <li id="shipper" className="yes_acc"><Link to="/shipper"><i className="fa-solid fa-gear"></i> Shipper</Link></li>
                  <li className="yes_acc"><Link to="/my-orders"><i className="fa-solid fa-clipboard-list"></i> Đơn hàng của tôi</Link></li>
                  <li className="yes_acc"><Link id="dang_xuat" to="/"><i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất</Link></li>
                </ul>
              </li>


              <li className="cart">
                <Link to="/cart">
                  <i className="fa-solid fa-cart-shopping">
                    <div id="number_items" className="number_items">0</div>
                  </i>
                  <span>Giỏ hàng</span>
                </Link>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* NAV */}
      <div className="header_nav">
        <div className="container">
          <ul className="nav">
            <li><Link to="/">Trang chủ</Link></li>
            <li><a href="#mon_chay">Món Chay</a></li>
            <li><a href="#mon_man">Món Mặn</a></li>
            <li><a href="#mon_lau">Món Lẩu</a></li>
            <li><a href="#an_vat">Ăn Vặt</a></li>
            <li><a href="#hoa_qua">Hoa Quả</a></li>
            <li><a href="#nuoc_uong">Nước Uống</a></li>
            <li><a href="">Khác</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
