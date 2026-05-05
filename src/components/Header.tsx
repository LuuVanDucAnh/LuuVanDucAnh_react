import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../images/Logo_icon.png";
import { getCart } from "../utils/cart";
import "../assets/css/Header.css";

const Header = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }

    const updateCartCount = () => {
      const cart = getCart();
      const count = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount(); // Khởi tạo số lượng giỏ hàng ban đầu
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("loginTime");
      setCurrentUser(null);
      alert("Đăng xuất thành công!");
      window.location.href = "/";
    }
  };

  const userRole = currentUser?.role?.toLowerCase() || '';

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
                  {!currentUser ? (
                    <span className="text_dndk">Đăng nhập / Đăng ký</span>
                  ) : (
                    <span className="text_tk">{currentUser.fullname || currentUser.username}<i className="fa-solid fa-caret-down"></i></span>
                  )}
                </div>
                <ul className="account_manager">
                  {!currentUser ? (
                    <>
                      <li className="no_acc"><Link to="/login"><i className="fa-solid fa-right-to-bracket"></i> Đăng nhập</Link></li>
                      <li className="no_acc"><Link to="/register"><i className="fa-solid fa-user-plus"></i> Đăng ký</Link></li>
                    </>
                  ) : (
                    <>
                      {userRole === "admin" && (
                        <>
                          <li className="yes_acc"><Link to="/admin"><i className="fa-solid fa-gear"></i> Quản lý cửa hàng</Link></li>
                          <li className="yes_acc"><Link to="/restaurant-admin"><i className="fa-solid fa-gear"></i> Quản lý nhà hàng</Link></li>
                          <li className="yes_acc"><Link to="/shipper"><i className="fa-solid fa-gear"></i> Shipper</Link></li>
                        </>
                      )}
                      {(userRole === "nhân viên" || userRole === "nhanvien" || userRole === "nhà hàng") && (
                        <li className="yes_acc"><Link to="/restaurant-admin"><i className="fa-solid fa-gear"></i> Quản lý nhà hàng</Link></li>
                      )}
                      {userRole === "shipper" && (
                        <li className="yes_acc"><Link to="/shipper"><i className="fa-solid fa-gear"></i> Shipper</Link></li>
                      )}
                      <li className="yes_acc"><Link to="/my-orders"><i className="fa-solid fa-clipboard-list"></i> Đơn hàng của tôi</Link></li>
                      <li className="yes_acc"><a href="#" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất</a></li>
                    </>
                  )}
                </ul>
              </li>


              <li className="cart">
                <Link to="/cart">
                  <i className="fa-solid fa-cart-shopping">
                    <div id="number_items" className="number_items">
                      {cartCount}
                    </div>
                  </i>
                  <span>Giỏ hàng</span>
                </Link>
              </li>

            </ul>
          </div>

        </div>
      </div>

      {/* NAV */}
      {!isAuthPage && (
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
      )}
    </div>
  );
};

export default Header;
