import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import OrderModal from "../components/Modal";

// 🔥 ĐÚNG với cấu trúc src/images
import namDong from "../images/Nam-dong.png";
import tauHu from "../images/Tau-hu-chien.png";

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
    <div>
      <Header />

      <h1>TRANG HOME</h1> {/* 🔥 test chắc chắn render */}

      <div>
        {/* Slide */}
        <div>
          <button>{"<"}</button>
          <img src={namDong} alt="slide" width="200" />
          <button>{">"}</button>
        </div>

        {/* Service */}
        <div>
          <h3>Giao hàng tận nơi</h3>
          <p>Nhanh chóng</p>
        </div>

        {/* Product */}
        <div>
          <h2>Món Chay</h2>

          <div>
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