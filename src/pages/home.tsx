import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import OrderModal from "../components/Modal";

import namDong from "../images/Nam-dong.png";
import tauHu from "../images/Tau-hu-chien.png";
import slide1 from "../images/Slide1.png";
import "../assets/css/style_home.css";

const Home = () => {
  const products = [
    {
      name: "Nấm sốt đông",
      price: 20000,
      image: namDong,
    },
    {
      name: "Tàu hũ chiên giòn",
      price: 30000,
      image: tauHu,
    },
  ];

  return (
    <div className="home">
      <Header />

      <div className="home_container">
        {/* Slide */}
        <div className="slide">
          <button className="slide_btn slide_btn_prev">{"<"}</button>
          <img src={slide1} alt="slide" />
          <button className="slide_btn slide_btn_next">{">"}</button>
        </div>

        {/* Service */}
        <div className="service">
          <div className="service_item">
            <i className="fa-solid fa-truck-fast"></i>
            <div className="service_content">
              <h3>Giao hàng tận nơi</h3>
              <p>Giao hàng nhanh chóng và tiện lợi đến tay bạn</p>
            </div>
          </div>
          <div className="service_item">
            <i className="fa-solid fa-shield-halved"></i>
            <div className="service_content">
              <h3>Sản phẩm an toàn</h3>
              <p>Cam kết chất lượng đạt tiêu chuẩn</p>
            </div>
          </div>
          <div className="service_item">
            <i className="fa-solid fa-credit-card"></i>
            <div className="service_content">
              <h3>Thanh toán an toàn</h3>
              <p>Hỗ trợ phương thức thanh toán an toàn, bảo mật.</p>
            </div>
          </div>
          <div className="service_item">
            <i className="fa-solid fa-headset"></i>
            <div className="service_content">
              <h3>Hỗ trợ 24/7</h3>
              <p>Đội ngũ hỗ trợ khách hàng luôn sẵn sàng phục vụ bạn.</p>
            </div>
          </div>
        </div>

        {/* Product */}
        <div className="product_section">
          <h2 className="product_title">Món Chay</h2>

          <div className="product_list">
            {products.map((item, index) => (
              <ProductCard key={index} product={item} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
      {/* <OrderModal /> */}
    </div>
  );
};

export default Home;