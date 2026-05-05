import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import axiosClient from "../utils/api";

import slide1 from "../images/Slide1.png";
import slide2 from "../images/Slide2.png";
import slide3 from "../images/Slide3.png";
import "../assets/css/style_home.css";

const Home = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await axiosClient.get('/foods/Food/GetAll-NhaHang');
        // Map lại dữ liệu để tương thích với ProductCard nếu cần
        const formattedData = res.data.map((item: any) => ({
          id: item.maNhaHang,
          name: item.tenNhaHang,
          description: item.diaChi,
          image: item.hinhAnh?.startsWith('http') ? item.hinhAnh : null,
          price: item.minOrder ? item.minOrder.toLocaleString() + 'đ' : '0đ',
          rating: 4.5 + (Math.random() * 0.5), // Mock rating vì DB chưa có
          maDanhMuc: item.maDanhMuc || 1
        }));
        setRestaurants(formattedData);
      } catch (error) {
        console.error("Lỗi khi tải danh sách nhà hàng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Phân loại nhà hàng theo danh mục (ID từ Database)
  const getRestaurantsByCategory = (catId: number) => {
    return restaurants.filter(r => r.maDanhMuc === catId);
  };


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