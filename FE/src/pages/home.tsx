import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import OrderModal from "../components/Modal";

import namDong from "../images/Nam-dong.png";
import tauHu from "../images/Tau-hu-chien.png";
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

      <h1>TRANG HOME</h1> 

      <div className="home_container">
        {/* Slide */}
        <div className="slide">
          <button className="slide_btn_prev">{"<"}</button>
          <img src={namDong} alt="slide" width="200" />
          <button className="slide_btn_next">{">"}</button>
        </div>

        {/* Service */}
        <div className="service">
          <div className="service_item">
            <h3>Giao hàng tận nơi</h3>
            <p>Nhanh chóng</p>
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
      <OrderModal />
    </div>
  );
};

export default Home;