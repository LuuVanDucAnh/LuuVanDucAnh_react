import logo from "../images/Logo_icon.png";
import "../assets/css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* TOP */}
        <div className="footer_top">
          <div className="footer_logo_container">
            <div className="footer_logo">
              <img src={logo} alt="DA FOOD" />
            </div>
            <div className="vertical-line"></div>
            <div className="footer_subscribe">
              <div className="footer_subscribe_text">
                <h3>ĐĂNG KÝ NHẬN TIN</h3>
                <p>Nhận thông tin mới nhất từ chúng tôi</p>
              </div>
              <form className="footer_form" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  required
                />
                <button type="submit">
                  ĐĂNG KÝ <i className="fa-solid fa-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="footer_content">
          <div className="widget_row">
            {/* ABOUT */}
            <div className="widget_col about_col">
              <h3>VỀ CHÚNG TÔI</h3>
              <p>
                DA Food là thương hiệu được thành lập vào năm 2025 với tiêu chí đặt chất lượng sản phẩm lên hàng đầu.
              </p>
              <div className="social_icons">
                <a href="#"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#"><i className="fa-brands fa-twitter"></i></a>
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-brands fa-whatsapp"></i></a>
              </div>
            </div>

            {/* LINKS */}
            <div className="widget_col">
              <h3>LIÊN KẾT</h3>
              <ul>
                <li><i className="fa-solid fa-arrow-right"></i> Về chúng tôi</li>
                <li><i className="fa-solid fa-arrow-right"></i> Thực đơn</li>
                <li><i className="fa-solid fa-arrow-right"></i> Điều khoản</li>
                <li><i className="fa-solid fa-arrow-right"></i> Liên hệ</li>
                <li><i className="fa-solid fa-arrow-right"></i> Tin tức</li>
              </ul>
            </div>

            {/* MENU */}
            <div className="widget_col">
              <h3>THỰC ĐƠN</h3>
              <ul>
                <li><i className="fa-solid fa-arrow-right"></i> Điểm tâm</li>
                <li><i className="fa-solid fa-arrow-right"></i> Món chay</li>
                <li><i className="fa-solid fa-arrow-right"></i> Món mặn</li>
                <li><i className="fa-solid fa-arrow-right"></i> Nước uống</li>
                <li><i className="fa-solid fa-arrow-right"></i> Tráng miệng</li>
              </ul>
            </div>

            {/* CONTACT */}
            <div className="widget_col contact_col">
              <h3>LIÊN HỆ</h3>
              <div className="contact_item">
                <div className="icon_circle"><i className="fa-solid fa-location-dot"></i></div>
                <p>La Tiến, Tống Trân,<br/> Phù Cừ, Hưng Yên</p>
              </div>
              <div className="contact_item">
                <div className="icon_circle"><i className="fa-solid fa-phone"></i></div>
                <p>0123 456 789<br/>0987 654 321</p>
              </div>
              <div className="contact_item">
                <div className="icon_circle"><i className="fa-solid fa-envelope"></i></div>
                <p>dafood@gmail.com<br/>da2k5@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;