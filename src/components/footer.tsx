import logo from "../assets/css/images/Logo_icon.png";
import "../assets/css/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">

        {/* TOP */}
        <div className="footer_top">
          <div className="footer_logo">
            <img src={logo} alt="DA FOOD" />
          </div>

          <div className="footer_email">
            <div>
              <h3>Đăng ký nhận tin</h3>
              <p>Nhận thông tin mới nhất từ chúng tôi</p>
            </div>

            <form className="footer_form">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                required
              />
              <button type="submit">
                Đăng ký <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </div>

        {/* CONTENT */}
        <div className="footer_content">
          <div className="widget_row">

            {/* ABOUT */}
            <div className="widget_row_col">
              <h3>Về chúng tôi</h3>
              <p>
                DA Food là thương hiệu được thành lập năm 2025, cam kết chất lượng.
              </p>
            </div>

            {/* LINKS */}
            <div className="widget_row_col">
              <h3>Liên kết</h3>
              <ul>
                <li>Về chúng tôi</li>
                <li>Thực đơn</li>
                <li>Điều khoản</li>
                <li>Liên hệ</li>
              </ul>
            </div>

            {/* MENU */}
            <div className="widget_row_col">
              <h3>Thực đơn</h3>
              <ul>
                <li>Món chay</li>
                <li>Món mặn</li>
                <li>Nước uống</li>
              </ul>
            </div>

            {/* CONTACT */}
            <div className="widget_row_col">
              <h3>Liên hệ</h3>
              <p>Hưng Yên</p>
              <p>0123 456 789</p>
              <p>dafood@gmail.com</p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Footer;