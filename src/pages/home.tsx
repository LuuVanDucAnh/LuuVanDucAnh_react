import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

import slide1 from "../images/Slide1.png";
import slide2 from "../images/Slide2.png";
import slide3 from "../images/Slide3.png";
import "../assets/css/style_home.css";

// Món Chay
import namDong from "../images/Nam-dong.png";
import tauHu from "../images/Tau-hu-chien.png";
import chaGioChay from "../images/Cha-gio-chay.png";
import comChienChay from "../images/Com-chien-chay.png";

// Món Mặn
import gaChienMam from "../images/Ga-chien-mam.jpg";
import suonRamMan from "../images/Suon-ram-man.jpg";
import thitKhoTrung from "../images/Thit-kho-trung.jpg";
import caKhoTo from "../images/Ca-kho-to.jpg";

// Món Lẩu
import lauThai from "../images/Lau-thai.jpg";
import lauHS from "../images/Lau-hs-tc.jpg";
import lauGaLaE from "../images/Lau-ga-la-e.jpg";
import lauBoNam from "../images/Lau-bo-nam.jpg";

// Ăn Vặt
import banhTrangTron from "../images/Banh-trang-tron.jpg";
import caVienChien from "../images/Ca-vien-chien.jpg";
import khoaiTayChien from "../images/Khoai-tay-chien.jpg";

// Hoa Quả
import duaHau from "../images/Dua-hau.jpg";
import thanhLong from "../images/Thanh-long.jpg";
import mit from "../images/Mit.jpg";
import oi from "../images/Oi.jpg";

// Nước Uống
import traSuaMatcha from "../images/Tra-sua-matcha.jpg";
import sinhToBo from "../images/Sinh-to-bo.jpg";
import traDaoCamXa from "../images/Tra-dao-cam-xa.jpg";
import traTac from "../images/Tra-tac.jpg";

// Sample data for categories
const MON_CHAY = [
  { id: 1, name: "Nhà Hàng Chay Tâm An", rating: 4.8, price: "50.000 VNĐ", image: namDong, description: "Chuyên phục vụ các món chay thanh đạm, tốt cho sức khỏe", dishes: "8 món", time: "30-45 phút" },
  { id: 2, name: "Nhà Hàng Chay Thanh Tịnh", rating: 4.7, price: "30.000 VNĐ", image: tauHu, description: "Không gian yên tĩnh, món ăn thanh đạm chuẩn vị chay", dishes: "12 món", time: "15-20 phút" },
  { id: 21, name: "Cơm Chiên Chay", rating: 4.6, price: "45.000 VNĐ", image: comChienChay, description: "Cơm chiên hạt dẻo thơm, rau củ tươi ngon", dishes: "1 món", time: "10-15 phút" },
  { id: 22, name: "Chả Giò Chay", rating: 4.5, price: "35.000 VNĐ", image: chaGioChay, description: "Chả giò giòn rụm, nhân nấm và miến hấp dẫn", dishes: "1 món", time: "10-15 phút" },
];

const MON_MAN = [
  { id: 3, name: "Nhà Hàng Gia Đình", rating: 4.9, price: "60.000đ", image: gaChienMam, description: "Đậm đà hương vị gia đình Việt với thực đơn phong phú." },
  { id: 4, name: "Nhà Hàng Đặc Sản Miền Bắc", rating: 4.6, price: "55.000đ", image: suonRamMan, description: "Các món đặc sản chuẩn vị Bắc Bộ, thơm ngon khó cưỡng." },
  { id: 5, name: "Nhà Hàng Hải Sản Tươi Sống", rating: 4.8, price: "50.000đ", image: thitKhoTrung, description: "Món ăn truyền thống, đậm đà đưa cơm." },
  { id: 51, name: "Quán Cơm Văn Phòng", rating: 4.7, price: "70.000đ", image: caKhoTo, description: "Cá kho tộ thơm lừng, đậm vị miền Tây." },
];

const MON_LAU = [
  { id: 6, name: "Lẩu & Nướng Hải Sản", rating: 4.5, price: "250.000đ", image: lauHS, description: "Tiệc lẩu nướng đa dạng, không gian thoáng mát." },
  { id: 7, name: "Nhà Hàng Lẩu Buffet", rating: 4.7, price: "200.000đ", image: lauThai, description: "Nước lẩu chua cay chuẩn vị Thái, đồ nhúng tươi ngon." },
  { id: 71, name: "Nhà Hàng Hải Sản Tươi Sống", rating: 4.8, price: "180.000đ", image: lauGaLaE, description: "Đặc sản hải sản biển tươi ngon." },
];

const AN_VAT = [
  { id: 8, name: "Lẩu & Nướng Hải Sản", rating: 4.5, price: "20.000đ", image: banhTrangTron, description: "Món ăn vặt quốc dân với đầy đủ topping hấp dẫn." },
  { id: 9, name: "Quán Ăn Vặt Hương Vị", rating: 4.4, price: "15.000đ", image: caVienChien, description: "Xiên que nóng hổi, giòn tan kèm nước sốt đặc biệt." },
  { id: 10, name: "Quán Bánh Mì & Bánh Bao", rating: 4.6, price: "25.000đ", image: khoaiTayChien, description: "Khoai tây chiên giòn, vàng ươm, kèm tương cà." },
  { id: 11, name: "Nhà Hàng Món Nhật", rating: 4.6, price: "25.000đ", image: banhTrangTron, description: "Khoai tây chiên giòn, vàng ươm, kèm tương cà." },
];

const HOA_QUA = [
  { id: 12, name: "Lẩu & Nướng Hải Sản", rating: 4.8, price: "30.000đ", image: duaHau, description: "Dưa hấu ngọt lịm, giải khát tức thì." },
  { id: 13, name: "Trái Cây Tươi Sạch", rating: 4.7, price: "35.000đ", image: thanhLong, description: "Thanh long bổ dưỡng, màu sắc bắt mắt." },
];

const NUOC_UONG = [
  { id: 14, name: "Lẩu & Nướng Hải Sản", rating: 4.9, price: "45.000đ", image: traSuaMatcha, description: "Vị trà xanh đậm đà hòa quyện cùng sữa béo ngậy." },
  { id: 15, name: "Quán Nước Giải Khát", rating: 4.8, price: "50.000đ", image: sinhToBo, description: "Bơ sáp dẻo quánh, bổ dưỡng cho sức khỏe." },
  { id: 16, name: "Quán Trà Sữa & Cà Phê", rating: 4.7, price: "40.000đ", image: traDaoCamXa, description: "Thức uống giải nhiệt thơm lừng hương đào và sả." },
];


const Home = () => {
  return (
    <div className="home">
      <Header />

      <main className="main">
        <div className="container">
          {/* Hero Slider */}
          <div className="slide_show">
              <button className="prev_btn"><i className="fa-solid fa-chevron-left"></i></button>
              <img src={slide1} alt="Slide Show" />
              <button className="next_btn"><i className="fa-solid fa-chevron-right"></i></button>
          </div>

          {/* Core Services */}
          <div className="slide_service">
              <div className="service_item">
                  <i className="fa-solid fa-truck-fast"></i>
                  <div className="service_text">
                      <h3>Giao hàng tận nơi</h3>
                      <p>Giao hàng nhanh chóng và tiện lợi đến tay bạn</p>
                  </div>
              </div>
              <div className="service_item">
                  <i className="fa-solid fa-shield-heart"></i>
                  <div className="service_text">
                      <h3>Sản phẩm an toàn</h3>
                      <p>Cam kết chất lượng đạt tiêu chuẩn</p>
                  </div>
              </div>
              <div className="service_item">
                  <i className="fa-solid fa-credit-card"></i>
                  <div className="service_text">
                      <h3>Thanh toán an toàn</h3>
                      <p>Hỗ trợ phương thức thanh toán an toàn, bảo mật.</p>
                  </div>
              </div>
              <div className="service_item">
                  <i className="fa-solid fa-headset"></i>
                  <div className="service_text">
                      <h3>Hỗ trợ 24/7</h3>
                      <p>Đội ngũ hỗ trợ khách hàng luôn sẵn sàng phục vụ bạn.</p>
                  </div>
              </div>
          </div>

          {/* Food Sections */}
          <FoodSection title="Món Chay" id="mon_chay" products={MON_CHAY} />
          <FoodSection title="Món Mặn" id="mon_man" products={MON_MAN} />
          <FoodSection title="Món Lẩu" id="mon_lau" products={MON_LAU} />
          <FoodSection title="Ăn Vặt" id="an_vat" products={AN_VAT} />
          <FoodSection title="Hoa Quả" id="hoa_qua" products={HOA_QUA} />
          <FoodSection title="Nước Uống" id="nuoc_uong" products={NUOC_UONG} />

        </div>
      </main>

      <Footer />
    </div>
  );
};

const FoodSection = ({ title, id, products }: any) => (
  <div className="product">
      <h2 className="product_title" id={id}>{title}</h2>
      <div id={`restaurants_${id}`} className="restaurants-container">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
  </div>
);

export default Home;