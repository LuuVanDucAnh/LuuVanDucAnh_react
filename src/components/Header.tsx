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

                <div className="text text_tk" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  Đăng nhập/Đăng ký <i className="fa-solid fa-caret-down" style={{ fontSize: "14px", color: "black" }}></i>
                </div>

                <ul className="account_manager">
                  <li><Link to="/login">Đăng nhập</Link></li>
                  <li><Link to="/register">Đăng ký</Link></li>
                  <li><Link to="/admin">Quản lý</Link></li>
                  <li><Link to="/">Đăng xuất</Link></li>
                </ul>
              </li>

              <li className="cart">
                <Link to="/cart">
                  <i className="fa-solid fa-cart-shopping">
                    <div className="number_items">2</div>
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
            <li><Link to="/">TRANG CHỦ</Link></li>
            <li><a href="#mon_chay">MÓN CHAY</a></li>
            <li><a href="#mon_man">MÓN MẶN</a></li>
            <li><a href="#mon_lau">MÓN LẨU</a></li>
            <li><a href="#an_vat">ĂN VẶT</a></li>
            <li><a href="#hoa_qua">HOA QUẢ</a></li>
            <li><a href="#nuoc_uong">NƯỚC UỐNG</a></li>
            <li><a href="#khac">KHÁC</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
