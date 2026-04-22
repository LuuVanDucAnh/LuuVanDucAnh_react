import logo from "../images/Logo_icon.png";
import "../assets/css/Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="container">
        <div className="footer_top">
          <div className="footer_logo border_right">
            <img src={logo} alt="DA FOOD" />
          </div>
          <div className="footer_email">
            <div className="footer_email_text">
              <h3>Đăng ký nhận tin</h3>
              <p>Nhận thông tin mới nhất từ chúng tôi</p>
            </div>
            <form action="" className="footer_form" onSubmit={(e) => e.preventDefault()}>
              <input autoComplete="off" type="email" placeholder="Nhập email của bạn" required />
              <button type="submit">Đăng ký <i className="fa-solid fa-arrow-right"></i></button>
            </form>
          </div>
        </div>
        <div className="footer_content">
          <div className="widget_row">
            <div className="widget_row_col">
              <h3 className="widget_title">Về chúng tôi</h3>
              <div className="widget_row_col_content">
                <p>DA Food là thương hiệu được thành lập vào năm 2025 với tiêu chí đặt chất lượng sản phẩm lên hàng đầu.</p>
              </div>
              <div className="widget_social">
                <div className="widget_social_item">
                  <a href="">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                </div>
                <div className="widget_social_item">
                  <a href="">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
                <div className="widget_social_item">
                  <a href="">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
                <div className="widget_social_item">
                  <a href="">
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="widget_row_col">
              <h3 className="widget_title">Liên kết</h3>
              <ul className="widget_contact">
                <li className="widget_contact_item">
                  <a href="">
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>Về chúng tôi</span>
                  </a>
                </li>
                <li className="widget_contact_item">
                  <a href="">
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>Thực đơn</span>
                  </a>
                </li>
                <li className="widget_contact_item">
                  <a href="">
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>Điều khoản</span>
                  </a>
                </li>
                <li className="widget_contact_item">
                    <a href="">
                      <i className="fa-solid fa-arrow-right"></i>
                      <span>Liên hệ</span>
                    </a>
                </li>
                <li className="widget_contact_item">
                  <a href="">
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>Tin tức</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="widget_row_col">
              <h3 className="widget_title">Thực đơn</h3>
              <ul className="widget_contact">
                <li className="widget_contact_item">
                  <a href="">
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>Điểm tâm</span>
                  </a>
                </li>
                <li className="widget_contact_item">
                  <a href="">
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>Món chay</span>
                  </a>
                </li>
                <li className="widget_contact_item">
                  <a href="">
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>Món mặn</span>
                  </a>
                </li>
                <li className="widget_contact_item">
                  <a href="">
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>Nước uống</span>
                  </a>
                </li>
                <li className="widget_contact_item">
                  <a href="">
                    <i className="fa-solid fa-arrow-right"></i>
                    <span>Tráng miệng</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="widget_row_col">
              <h3 className="widget_title">Liên hệ</h3>
              <div className="contact">
                <div className="contact_item">
                  <div className="contact_item_icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div className="contact_content">
                    <span>La Tiến, Tống Trân,</span><br />
                    <span>Phù Cừ, Hưng Yên</span>
                  </div>
                </div>
                <div className="contact_item">
                  <div className="contact_item_icon">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div className="contact_content contact_item_phone">
                    <span>0123 456 789</span>
                    <br />
                    <span>0987 654 321</span>
                  </div>
                </div>
                <div className="contact_item">
                  <div className="contact_item_icon">
                    <i className="fa-solid fa-envelope"></i>
                  </div>
                  <div className="contact_content contact_item_email">
                    <span>dafood@gmail.com</span><br />
                    <span>da2k5@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

