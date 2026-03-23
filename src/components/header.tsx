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

              <input
                type="text"
                placeholder="Tìm kiếm món ăn"
                autoComplete="off"
              />

              <button type="submit">
                <i className="fa-solid fa-filter"></i>
                Lọc
              </button>
            </form>
          </div>

          {/* ACCOUNT + CART */}
          <div className="header_top_right">
            <ul className="header_list">

              {/* ACCOUNT */}
              <li className="account">
                <i className="fa-solid fa-user"></i>

                <div className="text">
                  <span className="text_dndk">Đăng nhập / Đăng ký</span>
                  <span className="text_tk">
                    Tài khoản <i className="fa-solid fa-caret-down"></i>
                  </span>
                </div>

                <ul className="account_manager">
                  <li>
                    <Link to="/login">
                      <i className="fa-solid fa-right-to-bracket"></i> Đăng nhập
                    </Link>
                  </li>

                  <li>
                    <Link to="/register">
                      <i className="fa-solid fa-user-plus"></i> Đăng ký
                    </Link>
                  </li>

                  <li>
                    <Link to="/admin">
                      <i className="fa-solid fa-gear"></i> Quản lý
                    </Link>
                  </li>

                  <li>
                    <Link to="/">
                      <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
                    </Link>
                  </li>
                </ul>
              </li>

              {/* CART */}
              <li className="cart">
                <Link to="/cart">
                  <i className="fa-solid fa-cart-shopping">
                    <div className="number_items">0</div>
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
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;