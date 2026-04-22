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
  { id: 1, name: "Nhà Hàng Chay Tâm An", rating: 4.8, price: "20.000đ", image: namDong, description: "Chuyên các món chay thanh tịnh, tự nhiên và giàu dinh dưỡng." },
  { id: 2, name: "Nhà Hàng Chay Thanh Tịnh", rating: 4.7, price: "30.000đ", image: tauHu, description: "Không gian yên tĩnh, món ăn thanh đạm chuẩn vị chay." },
  { id: 21, name: "Cơm Chiên Chay", rating: 4.6, price: "45.000đ", image: comChienChay, description: "Cơm chiên hạt dẻo thơm, rau củ tươi ngon." },
  { id: 22, name: "Chả Giò Chay", rating: 4.5, price: "35.000đ", image: chaGioChay, description: "Chả giò giòn rụm, nhân nấm và miến hấp dẫn." },
];

const MON_MAN = [
  { id: 3, name: "Nhà Hàng Gia Đình", rating: 4.9, price: "60.000đ", image: gaChienMam, description: "Đậm đà hương vị gia đình Việt với thực đơn phong phú." },
  { id: 4, name: "Sườn Ram Mặn", rating: 4.6, price: "55.000đ", image: suonRamMan, description: "Các món đặc sản chuẩn vị Bắc Bộ, thơm ngon khó cưỡng." },
  { id: 5, name: "Thịt Kho Trứng", rating: 4.8, price: "50.000đ", image: thitKhoTrung, description: "Món ăn truyền thống, đậm đà đưa cơm." },
  { id: 51, name: "Cá Kho Tộ", rating: 4.7, price: "70.000đ", image: caKhoTo, description: "Cá kho tộ thơm lừng, đậm vị miền Tây." },
];

const MON_LAU = [
  { id: 6, name: "Lẩu & Nướng Hải Sản", rating: 4.5, price: "250.000đ", image: lauHS, description: "Tiệc lẩu nướng đa dạng, không gian thoáng mát." },
  { id: 7, name: "Nhà Hàng Lẩu Thái", rating: 4.7, price: "200.000đ", image: lauThai, description: "Nước lẩu chua cay chuẩn vị Thái, đồ nhúng tươi ngon." },
  { id: 71, name: "Lẩu Gà Lá É", rating: 4.8, price: "180.000đ", image: lauGaLaE, description: "Đặc sản Đà Lạt giữa lòng thành phố." },
  { id: 72, name: "Lẩu Bò Nấm", rating: 4.6, price: "220.000đ", image: lauBoNam, description: "Thịt bò tươi ngon phối hợp cùng các loại nấm." },
];

const AN_VAT = [
  { id: 8, name: "Bánh Tráng Trộn", rating: 4.5, price: "20.000đ", image: banhTrangTron, description: "Món ăn vặt quốc dân với đầy đủ topping hấp dẫn." },
  { id: 9, name: "Cá Viên Chiên", rating: 4.4, price: "15.000đ", image: caVienChien, description: "Xiên que nóng hổi, giòn tan kèm nước sốt đặc biệt." },
  { id: 10, name: "Khoai Tây Chiên", rating: 4.6, price: "25.000đ", image: khoaiTayChien, description: "Khoai tây chiên giòn, vàng ươm, kèm tương cà." },
];

const HOA_QUA = [
  { id: 11, name: "Dưa Hấu Tươi", rating: 4.8, price: "30.000đ", image: duaHau, description: "Dưa hấu ngọt lịm, giải khát tức thì." },
  { id: 12, name: "Thanh Long Đỏ", rating: 4.7, price: "35.000đ", image: thanhLong, description: "Thanh long bổ dưỡng, màu sắc bắt mắt." },
  { id: 13, name: "Mít Thái", rating: 4.6, price: "40.000đ", image: mit, description: "Mít giòn, ngọt, thơm nồng." },
  { id: 14, name: "Ổi Giòn", rating: 4.5, price: "20.000đ", image: oi, description: "Ổi tươi ngon, giàu Vitamin C." },
];

const NUOC_UONG = [
  { id: 15, name: "Trà Sữa Matcha", rating: 4.9, price: "45.000đ", image: traSuaMatcha, description: "Vị trà xanh đậm đà hòa quyện cùng sữa béo ngậy." },
  { id: 16, name: "Sinh Tố Bơ", rating: 4.8, price: "50.000đ", image: sinhToBo, description: "Bơ sáp dẻo quánh, bổ dưỡng cho sức khỏe." },
  { id: 17, name: "Trà Đào Cam Sả", rating: 4.7, price: "40.000đ", image: traDaoCamXa, description: "Thức uống giải nhiệt thơm lừng hương đào và sả." },
  { id: 18, name: "Trà Tắc", rating: 4.5, price: "15.000đ", image: traTac, description: "Vị chua thanh mát, giải tỏa cơn khát nhanh chóng." },
];


const Home = () => {
  return (
    <div className="home">
      <Header />

      <main className="home_content">
        <div className="container">
          {/* Hero Slider */}
          <section className="hero_slider">
            <div className="slider_container">
              <button className="slider_arrow prev_arrow"><i className="fa-solid fa-chevron-left"></i></button>
              <div className="slider_track">
                <img src={slide1} alt="Delicious Food Slider" />
              </div>
              <button className="slider_arrow next_arrow"><i className="fa-solid fa-chevron-right"></i></button>
            </div>
          </section>

          {/* Core Services */}
          <section className="services_section">
            <div className="service_grid">
              <div className="service_card">
                <div className="service_icon"><i className="fa-solid fa-truck-fast"></i></div>
                <div className="service_info">
                  <h4>Giao hàng tận nơi</h4>
                  <p>Giao hàng nhanh chóng và tiện lợi đến tận tay bạn.</p>
                </div>
              </div>
              <div className="service_card">
                <div className="service_icon"><i className="fa-solid fa-shield-halved"></i></div>
                <div className="service_info">
                  <h4>Sản phẩm an toàn</h4>
                  <p>Cam kết chất lượng đạt tiêu chuẩn an toàn vệ sinh.</p>
                </div>
              </div>
              <div className="service_card">
                <div className="service_icon"><i className="fa-solid fa-credit-card"></i></div>
                <div className="service_info">
                  <h4>Thanh toán bảo mật</h4>
                  <p>Hỗ trợ nhiều phương thức thanh toán an toàn.</p>
                </div>
              </div>
              <div className="service_card">
                <div className="service_icon"><i className="fa-solid fa-headset"></i></div>
                <div className="service_info">
                  <h4>Hỗ trợ 24/7</h4>
                  <p>Đội ngũ hỗ trợ luôn sẵn sàng phục vụ bạn mọi lúc.</p>
                </div>
              </div>
            </div>
          </section>


          {/* Food Sections */}
          <FoodSection title="MÓN CHAY" id="mon_chay" products={MON_CHAY} />
          <FoodSection title="MÓN MẶN" id="mon_man" products={MON_MAN} />
          <FoodSection title="MÓN LẨU" id="mon_lau" products={MON_LAU} />
          <FoodSection title="ĂN VẶT" id="an_vat" products={AN_VAT} />
          <FoodSection title="HOA QUẢ" id="hoa_qua" products={HOA_QUA} />
          <FoodSection title="NƯỚC UỐNG" id="nuoc_uong" products={NUOC_UONG} />

        </div>
      </main>

      <Footer />
    </div>
  );
};

const FoodSection = ({ title, id, products }: any) => (
  <section className="food_category_section" id={id}>
    <div className="section_header">
      <h2 className="section_title">{title}</h2>
      <div className="title_underline"></div>
    </div>
    <div className="product_grid">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  </section>
);

export default Home;