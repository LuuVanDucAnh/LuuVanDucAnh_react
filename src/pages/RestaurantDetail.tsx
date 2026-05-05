import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import OrderModal, { Dish } from "../components/Modal";
import { getCart, saveCart } from "../utils/cart";
import axiosClient from "../utils/api";
import "../assets/css/style_restaurant.css";

const RestaurantDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const restaurant = location.state?.restaurant;
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      if (!restaurant?.id) return;
      try {
        const res = await axiosClient.get(`/foods/Food/nhahang/${restaurant.id}/monan`);
        setDishes(res.data);
      } catch (error) {
        console.error("Lỗi khi tải thực đơn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDishes();
  }, [restaurant]);

  // Thêm món vào giỏ
  const addToCart = (dish: Dish, quantity: number = 1) => {
    const currentCart = getCart();
    const existingItem = currentCart.find((item) => item.id === String(dish.maMonAn));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({
        id: String(dish.maMonAn),
        name: dish.tenMon,
        price: dish.gia,
        image: dish.hinhAnh,
        quantity: quantity,
        restaurantName: restaurant?.name || "Nhà hàng",
        maNhaHang: restaurant?.id
      });
    }
    saveCart(currentCart);
    
    // Show toast instead of alert
    setToastMessage(`Đã thêm ${quantity} x ${dish.tenMon} vào giỏ hàng`);
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
                  src={restaurant?.image || dishes[0]?.hinhAnh || "https://via.placeholder.com/400x300?text=Nha+Hang"}
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
              {loading ? (
                <p>Đang tải thực đơn...</p>
              ) : dishes.length > 0 ? (
                dishes.map((dish) => (
                  <div className="product_item" key={dish.maMonAn}>
                    <img src={dish.hinhAnh?.startsWith('http') ? dish.hinhAnh : require(`../images/anh-chung.jpg`)} alt={dish.tenMon} />
                    <h3>{dish.tenMon}</h3>
                    <p>{dish.gia?.toLocaleString("vi-VN")}đ</p>
                    <button onClick={() => setSelectedDish(dish)}>
                      <i className="fa-solid fa-cart-shopping"></i> Đặt hàng
                    </button>
                  </div>
                ))
              ) : (
                <p>Nhà hàng chưa cập nhật thực đơn.</p>
              )}
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
