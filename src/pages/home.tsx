import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import OrderModal from "../components/Modal";

import namDong from "../assets/css/images/Nam-dong.png";
import tauHu from "../assets/css/images/Tau-hu-chien.png";

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
    <>
      <Header />

      <div className="main">
        <div className="container">
          {/* Slide */}
          <div className="slide_show">
            <button className="prev_btn">
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <img src={namDong} alt="slide" />

            <button className="next_btn">
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          {/* Service */}
          <div className="slide_service">
            <div className="service_item">
              <i className="fa-solid fa-truck-fast"></i>
              <div>
                <h3>Giao hàng tận nơi</h3>
                <p>Nhanh chóng</p>
              </div>
            </div>
          </div>

          {/* Product */}
          <div className="product">
            <h2 className="product_title">Món Chay</h2>

            <div className="productContainer">
              {products.map((item, index) => (
                <ProductCard key={index} product={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <OrderModal />
    </>
  );
};

export default Home;