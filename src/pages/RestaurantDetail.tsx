import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import OrderModal from "../components/Modal";
import { getCart, saveCart } from "../utils/cart";
import "../assets/css/style_restaurant.css";

// Món ăn mẫu cho từng nhà hàng
import baChiNuong from "../images/Ba-chi-nuong.jpg";
import bungGaoXao from "../images/Bun-gao-xao.jpg";
import caChienNuocMam from "../images/Ca-chien-nuoc-mam.jpg";
import gaiXoai from "../images/Goi-xoai.jpg";
import trungThitBam from "../images/Trung-thit-bam.jpg";
import chaoNamCaRot from "../images/Chao-nam-ca-rot.png";
import namKimCham from "../images/Nam-kim-cham-xao.png";
import tauHuNon from "../images/Tau-hu-non-sot-dong.png";
import mucXao from "../images/Muc-xao.jpg";
import tomRangMe from "../images/Tom-rang-me.jpg";
import lauNamHs from "../images/Lau-nam-hs.jpg";
import lauCaChuaCay from "../images/Lau-ca-chua-cay.jpg";

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
};

const SAMPLE_DISHES: Dish[] = [
  { id: 1, name: "Ba Chỉ Nướng", description: "Ba chỉ heo nướng than hoa, thơm ngon, giòn bì, kèm rau sống và nước chấm đặc biệt", price: 75000, image: baChiNuong, category: "Món chính", popular: true },
  { id: 2, name: "Bún Gạo Xào", description: "Bún gạo xào đặc sản với hải sản tươi ngon, giàu dinh dưỡng", price: 55000, image: bungGaoXao, category: "Món chính" },
  { id: 3, name: "Cá Chiên Nước Mắm", description: "Cá chiên vàng ươm, sốt nước mắm chua ngọt hấp dẫn", price: 65000, image: caChienNuocMam, category: "Món chính", popular: true },
  { id: 4, name: "Gỏi Xoài", description: "Gỏi xoài xanh trộn tôm thịt, vị chua cay giòn ngon", price: 45000, image: gaiXoai, category: "Món phụ" },
  { id: 5, name: "Trứng Thịt Bằm", description: "Trứng hấp thịt bằm mềm mịn, đậm vị umami", price: 40000, image: trungThitBam, category: "Món phụ" },
  { id: 6, name: "Cháo Nấm Cà Rốt", description: "Cháo nấm mềm thơm, cà rốt bùi ngọt, tốt cho sức khỏe", price: 35000, image: chaoNamCaRot, category: "Tráng miệng" },
  { id: 7, name: "Nấm Kim Châm Xào", description: "Nấm kim châm xào tỏi, giòn ngon, bổ dưỡng", price: 38000, image: namKimCham, category: "Món phụ" },
  { id: 8, name: "Tàu Hũ Non Sốt Đông", description: "Tàu hũ non mềm mịn, sốt đông bắp thơm béo", price: 42000, image: tauHuNon, category: "Tráng miệng" },
  { id: 9, name: "Mực Xào Cần Tây", description: "Mực tươi xào cần tây giòn, thơm ngon hấp dẫn", price: 85000, image: mucXao, category: "Lẩu & Hải sản", popular: true },
  { id: 10, name: "Tôm Rang Me", description: "Tôm sú rang me chua ngọt, đậm đà vị Việt", price: 95000, image: tomRangMe, category: "Lẩu & Hải sản" },
  { id: 11, name: "Lẩu Nấm Hải Sản", description: "Lẩu nấm kết hợp hải sản tươi, nước dùng thanh ngọt", price: 220000, image: lauNamHs, category: "Lẩu & Hải sản" },
  { id: 12, name: "Lẩu Cà Chua Cay", description: "Lẩu cà chua chua cay, đậm đà thêm hải sản", price: 195000, image: lauCaChuaCay, category: "Lẩu & Hải sản" },
];

const RestaurantDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const restaurant = location.state?.restaurant;
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Thêm món vào giỏ
  const addToCart = (dish: Dish, quantity: number = 1) => {
    const currentCart = getCart();
    const existingItem = currentCart.find((item) => item.id === String(dish.id));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({
        id: String(dish.id),
        name: dish.name,
        price: dish.price,
        image: dish.image,
        quantity: quantity,
      });
    }
    saveCart(currentCart);
    
    // Show toast instead of alert
    setToastMessage(`Đã thêm ${quantity} x ${dish.name} vào giỏ hàng`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <>
      <Header />
      <div className="main">
        <div className="container">
          {/* Thông tin nhà hàng */}
          <div id="restaurant-header" className="restaurant-header">
            <div className="restaurant-header-content">
              <div className="restaurant-header-image">
                <img
                  src={restaurant?.image || SAMPLE_DISHES[0].image}
                  alt={restaurant?.name || "Nhà hàng"}
                />
              </div>
              <div className="restaurant-header-info">
                <h1 className="restaurant-header-name">{restaurant?.name || "Nhà Hàng DA Food"}</h1>
                <p className="restaurant-header-description">
                  Nhà hàng cung cấp các món ăn ngon, đảm bảo vệ sinh an toàn thực phẩm. Luôn mang lại trải nghiệm tuyệt vời cho khách hàng.
                </p>
                <div className="restaurant-header-details">
                  <div className="restaurant-header-detail-item">
                    <i className="fa-solid fa-star"></i> {restaurant?.rating || "4.8"} / 5.0
                  </div>
                  <div className="restaurant-header-detail-item">
                    <i className="fa-solid fa-utensils"></i> {restaurant?.dishes || "12 món"}
                  </div>
                  <div className="restaurant-header-detail-item">
                    <i className="fa-regular fa-clock"></i> {restaurant?.time || "30–45 phút"}
                  </div>
                  <div className="restaurant-header-detail-item">
                    <i className="fa-solid fa-location-dot"></i> La Tiến, Tống Trân, Phù Cừ, Hưng Yên
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="product">
            <h2 className="product_title" id="restaurant-menu-title">
              Thực Đơn
            </h2>
            <div id="restaurant-products" className="productContainer">
              {SAMPLE_DISHES.map((dish) => (
                <div className="product_item" key={dish.id}>
                  <img src={dish.image} alt={dish.name} />
                  <h3>{dish.name}</h3>
                  <p>{dish.price.toLocaleString("vi-VN")}đ</p>
                  <button onClick={() => setSelectedDish(dish)}>
                    <i className="fa-solid fa-cart-shopping"></i> Đặt hàng
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <OrderModal 
        dish={selectedDish} 
        onClose={() => setSelectedDish(null)} 
        onAddToCart={addToCart} 
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <i className="fa-solid fa-circle-check"></i>
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default RestaurantDetail;
