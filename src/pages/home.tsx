import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { foodsService, Category, Food } from "../services/apiService";
import { getCart, saveCart } from "../utils/cart";
import { getImageUrl } from "../utils/image";

import slide1 from "../images/Slide1.png";
import slide2 from "../images/Slide2.png";
import slide3 from "../images/Slide3.png";
import "../assets/css/style_home.css";
import "../assets/css/style_modal.css";

const Home = () => {
  const [menu, setMenu] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menuRes = await foodsService.getMenu();
        setMenu(menuRes.menu || []);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addToCart = (food: Food, qty: number = 1) => {
    const currentCart = getCart();
    const existingItem = currentCart.find((item) => item.id === String(food.MaMonAn));
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      currentCart.push({
        id: String(food.MaMonAn),
        name: food.TenMon,
        price: food.Gia,
        image: food.HinhAnh,
        quantity: qty,
        restaurantName: "DA Food",
        maNhaHang: 1,
      });
    }
    saveCart(currentCart);
    setToastMessage(`Đã thêm ${qty} x ${food.TenMon} vào giỏ hàng`);
    setTimeout(() => setToastMessage(null), 3000);

    // Trừ đi số lượng khách đã đặt trong danh sách menu hiện tại
    setMenu(prevMenu => prevMenu.map(cat => ({
      ...cat,
      monAn: cat.monAn?.map(m => m.MaMonAn === food.MaMonAn ? { ...m, SoLuong: m.SoLuong !== undefined ? m.SoLuong - qty : undefined } : m)
    })));
  };

  const getCategoryIcon = (tenDanhMuc: string) => {
    const lower = tenDanhMuc.toLowerCase();
    if (lower.includes("mặn") || lower.includes("cơm")) return "fa-drumstick-bite";
    if (lower.includes("nước") || lower.includes("lẩu") || lower.includes("súp")) return "fa-bowl-food";
    if (lower.includes("uống") || lower.includes("trà") || lower.includes("sữa")) return "fa-mug-hot";
    if (lower.includes("vặt") || lower.includes("bánh") || lower.includes("khoai")) return "fa-cookie";
    return "fa-utensils";
  };

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


          {/* Menu by Category */}
          {loading ? (
            <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải thực đơn...</p>
          ) : (
            menu.map((cat) => (
              <div className="product" key={cat.MaDanhMuc}>
                <h2 className="product_title" id={`cat_${cat.MaDanhMuc}`}>
                  <i className={`fa-solid ${getCategoryIcon(cat.TenDanhMuc)}`}></i> {cat.TenDanhMuc}
                </h2>
                <div className="productContainer">
                  {(cat.monAn || []).map((food) => (
                    <div className="product_item" key={food.MaMonAn}>
                      <div onClick={() => navigate(`/food/${food.MaMonAn}`)} style={{ cursor: "pointer" }}>
                        <img
                          src={getImageUrl(food.HinhAnh)}
                          alt={food.TenMon}
                        />
                        <h3>{food.TenMon}</h3>
                      </div>
                      {food.MoTa && <p className="food-desc">{food.MoTa}</p>}
                      <p className="food-price">{Number(food.Gia).toLocaleString('vi-VN')}đ</p>
                      <div className="product-actions">
                        <button onClick={() => { setSelectedFood(food); setQuantity(1); }}>
                          <i className="fa-solid fa-cart-shopping"></i> Đặt hàng
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />

      {/* Food Detail Modal */}
      {selectedFood && (
        <div className="modal" onClick={() => setSelectedFood(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-modal" onClick={() => setSelectedFood(null)}>&times;</span>
            <h2>{selectedFood.TenMon}</h2>
            <hr className="modal-divider" />
            <div className="modal-body">
              <div className="modal-image">
                <img
                  src={getImageUrl(selectedFood.HinhAnh)}
                  alt={selectedFood.TenMon}
                />
              </div>
              <div className="modal-info">
                <p className="modal-price">
                  Giá: <span>{Number(selectedFood.Gia).toLocaleString('vi-VN')} VNĐ</span>
                </p>
                <p className="modal-desc">
                  Mô tả: <i>{selectedFood.MoTa || "Không có mô tả"}</i>
                </p>
                <div className="modal-quantity-section">
                  <span>Số lượng:</span>
                  <div style={{ fontSize: '14px', color: '#868e96', marginLeft: 'auto', marginRight: '15px' }}>
                    Còn: <strong>{selectedFood.SoLuong !== undefined ? selectedFood.SoLuong : 'Không giới hạn'}</strong>
                  </div>
                  <div className="modal-quantity">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="btn-qty" disabled={selectedFood.SoLuong === 0}>-</button>
                    <input type="number" value={selectedFood.SoLuong === 0 ? 0 : quantity} readOnly />
                    <button onClick={() => setQuantity(q => (selectedFood.SoLuong !== undefined && q >= selectedFood.SoLuong) ? q : q + 1)} className="btn-qty" disabled={selectedFood.SoLuong === 0 || (selectedFood.SoLuong !== undefined && quantity >= selectedFood.SoLuong)}>+</button>
                  </div>
                </div>
                <div className="modal-total">
                  Thành tiền: <span>{(Number(selectedFood.Gia) * (selectedFood.SoLuong === 0 ? 0 : quantity)).toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <button
                  className="btn-add-cart"
                  onClick={() => {
                    addToCart(selectedFood, quantity);
                    setSelectedFood(null);
                  }}
                  disabled={selectedFood.SoLuong === 0}
                  style={selectedFood.SoLuong === 0 ? { background: '#adb5bd', cursor: 'not-allowed', boxShadow: 'none' } : {}}
                >
                  {selectedFood.SoLuong === 0 ? "HẾT HÀNG" : "THÊM VÀO GIỎ HÀNG"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification">
          <i className="fa-solid fa-circle-check"></i>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Home;
