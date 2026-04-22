import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
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

type CartDish = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
};

// Danh sách món theo danh mục
const MENU_CATEGORIES = ["Tất cả", "Món chính", "Món phụ", "Lẩu & Hải sản", "Tráng miệng"];

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

const REVIEWS = [
  { id: 1, name: "Nguyễn Lan Anh", stars: 5, text: "Món ăn rất ngon, phục vụ chu đáo. Sẽ quay lại lần nữa!" },
  { id: 2, name: "Trần Minh Tú", stars: 4, text: "Không gian sạch sẽ, giá cả hợp lý. Mực xào cần tây ngon tuyệt!" },
  { id: 3, name: "Lê Thị Hoa", stars: 5, text: "Nhà hàng có nhiều món đa dạng, thích nhất là lẩu hải sản." },
  { id: 4, name: "Phạm Đức Mạnh", stars: 4, text: "Giao hàng nhanh, đồ ăn còn nóng. Ba chỉ nướng rất đáng thử." },
];

const RestaurantDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const restaurant = location.state?.restaurant;

  const [activeTab, setActiveTab] = useState("Tất cả");
  const [cartDishes, setCartDishes] = useState<CartDish[]>([]);

  // Lọc món theo danh mục
  const filteredDishes =
    activeTab === "Tất cả"
      ? SAMPLE_DISHES
      : SAMPLE_DISHES.filter((d) => d.category === activeTab);

  // Thêm món vào giỏ
  const addToCart = (dish: Dish) => {
    setCartDishes((prev) => {
      const exists = prev.find((item) => item.id === dish.id);
      if (exists) {
        return prev.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: dish.id, name: dish.name, price: dish.price, quantity: 1 }];
    });
  };

  // Thay đổi số lượng
  const changeQty = (id: number, delta: number) => {
    setCartDishes((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const totalPrice = cartDishes.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="restaurant_page">
      <Header />

      {/* HERO BANNER */}
      <div className="restaurant_hero">
        <img
          className="restaurant_hero_img"
          src={restaurant?.image || SAMPLE_DISHES[0].image}
          alt={restaurant?.name || "Nhà hàng"}
        />
        <div className="restaurant_hero_overlay">
          <div className="restaurant_hero_content">
            <h1>{restaurant?.name || "Nhà Hàng DA Food"}</h1>
            <div className="restaurant_hero_meta">
              <span className="hero_badge_open">
                <i className="fa-solid fa-circle" style={{ fontSize: 8, marginRight: 5 }}></i>
                Đang mở cửa
              </span>
              <span className="hero_meta_item">
                <i className="fa-solid fa-star"></i>
                {restaurant?.rating || "4.8"} / 5.0
              </span>
              <span className="hero_meta_item">
                <i className="fa-solid fa-utensils"></i>
                {restaurant?.dishes || "12 món"}
              </span>
              <span className="hero_meta_item">
                <i className="fa-regular fa-clock"></i>
                {restaurant?.time || "30–45 phút"}
              </span>
              <span className="hero_meta_item">
                <i className="fa-solid fa-wallet"></i>
                Từ {restaurant?.price || "50.000 VNĐ"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="restaurant_content">
        <div className="container">
          {/* NÚT QUAY LẠI */}
          <div className="back_btn_wrap">
            <button className="back_btn" onClick={() => navigate(-1)}>
              <i className="fa-solid fa-arrow-left"></i> Quay lại
            </button>
          </div>

          <div className="restaurant_layout">
            {/* ===== MENU CHÍNH ===== */}
            <div className="menu_main">
              <h2 className="menu_section_title">Thực đơn</h2>
              <div className="menu_title_line"></div>

              {/* Tab danh mục */}
              <div className="menu_tabs">
                {MENU_CATEGORIES.map((tab) => (
                  <button
                    key={tab}
                    className={`menu_tab${activeTab === tab ? " active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Grid món ăn */}
              <div className="menu_grid">
                {filteredDishes.map((dish) => (
                  <div className="dish_card" key={dish.id}>
                    <div className="dish_img_wrap">
                      <img src={dish.image} alt={dish.name} />
                      {dish.popular && (
                        <span className="dish_popular_badge">
                          <i className="fa-solid fa-fire"></i> Phổ biến
                        </span>
                      )}
                    </div>
                    <div className="dish_body">
                      <h3 className="dish_name">{dish.name}</h3>
                      <p className="dish_desc">{dish.description}</p>
                      <div className="dish_footer">
                        <span className="dish_price">
                          {dish.price.toLocaleString("vi-VN")}đ
                        </span>
                        <button
                          className="add_dish_btn"
                          title="Thêm vào giỏ"
                          onClick={() => addToCart(dish)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Đánh giá */}
              <div className="reviews_section">
                <h2 className="menu_section_title">Đánh giá khách hàng</h2>
                <div className="menu_title_line"></div>
                <div className="reviews_grid">
                  {REVIEWS.map((review) => (
                    <div className="review_card" key={review.id}>
                      <div className="review_header">
                        <div className="reviewer_avatar">
                          {review.name.charAt(0)}
                        </div>
                        <div className="reviewer_info">
                          <h4>{review.name}</h4>
                          <div className="reviewer_stars">
                            {"★".repeat(review.stars)}{"☆".repeat(5 - review.stars)}
                          </div>
                        </div>
                      </div>
                      <p className="review_text">"{review.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ===== SIDEBAR ===== */}
            <aside className="restaurant_sidebar">
              {/* Thông tin nhà hàng */}
              <div className="info_card">
                <h3 className="info_card_title">Thông tin nhà hàng</h3>
                <ul className="info_list">
                  <li>
                    <i className="fa-solid fa-location-dot"></i>
                    <span>La Tiến, Tống Trân, Phù Cừ, Hưng Yên</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-phone"></i>
                    <span>0123 456 789</span>
                  </li>
                  <li>
                    <i className="fa-regular fa-clock"></i>
                    <span>07:00 – 22:00 (Thứ 2 – Chủ nhật)</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-motorcycle"></i>
                    <span>Giao hàng trong vòng 5km, phí 15.000đ</span>
                  </li>
                  <li>
                    <i className="fa-solid fa-credit-card"></i>
                    <span>Tiền mặt, chuyển khoản, ví điện tử</span>
                  </li>
                </ul>
              </div>

              {/* Giỏ hàng mini */}
              <div className="cart_summary_card">
                <h3>
                  <i className="fa-solid fa-cart-shopping" style={{ marginRight: 8 }}></i>
                  Giỏ hàng ({cartDishes.reduce((s, i) => s + i.quantity, 0)} món)
                </h3>

                {cartDishes.length === 0 ? (
                  <div className="cart_empty_msg">
                    <i className="fa-solid fa-bowl-food"></i>
                    <p>Chưa có món nào<br />Hãy thêm món ăn!</p>
                  </div>
                ) : (
                  <>
                    {cartDishes.map((item) => (
                      <div className="cart_item_row" key={item.id}>
                        <span className="cart_item_name">{item.name}</span>
                        <div className="cart_item_qty">
                          <button className="qty_btn" onClick={() => changeQty(item.id, -1)}>−</button>
                          <span>{item.quantity}</span>
                          <button className="qty_btn" onClick={() => changeQty(item.id, 1)}>+</button>
                        </div>
                      </div>
                    ))}
                    <div className="cart_total_row">
                      <span>Tổng cộng:</span>
                      <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                    </div>
                    <button className="checkout_btn">
                      <i className="fa-solid fa-bag-shopping"></i> Đặt hàng ngay
                    </button>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RestaurantDetail;
