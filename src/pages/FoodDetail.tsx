import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { foodsService, Food } from "../services/apiService";
import { getCart, saveCart } from "../utils/cart";
import { getImageUrl } from "../utils/image";
import "../assets/css/style_food_detail.css";

const FoodDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [food, setFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFood = async () => {
      if (!id) return;
      try {
        const res = await foodsService.getFoodDetail(Number(id));
        setFood(res.food);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết món ăn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  const addToCart = () => {
    if (!food) return;
    const currentCart = getCart();
    const existingItem = currentCart.find((item) => item.id === String(food.MaMonAn));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.push({
        id: String(food.MaMonAn),
        name: food.TenMon,
        price: food.Gia,
        image: food.HinhAnh,
        quantity: quantity,
        restaurantName: "DA Food",
        maNhaHang: 1,
      });
    }
    saveCart(currentCart);
    setToastMessage(`Đã thêm ${quantity} x ${food.TenMon} vào giỏ hàng`);
    setTimeout(() => setToastMessage(null), 3000);
    
    // Trừ đi số lượng khách đã đặt
    setFood(prev => prev ? { ...prev, SoLuong: prev.SoLuong !== undefined ? prev.SoLuong - quantity : undefined } : prev);
    setQuantity(1);
  };

  if (loading) return <><Header /><div className="main"><p style={{textAlign:'center', padding: '100px'}}>Đang tải chi tiết món ăn...</p></div><Footer /></>;
  if (!food) return <><Header /><div className="main"><p style={{textAlign:'center', padding: '100px'}}>Không tìm thấy món ăn.</p></div><Footer /></>;

  return (
    <div className="food-detail-page">
      <Header />
      <main className="main">
        <div className="container">
          <button className="btn-back" onClick={() => navigate(-1)}>
            <i className="fa-solid fa-arrow-left"></i> Quay lại
          </button>
          
          <div className="food-detail-container">
            <div className="food-detail-image">
              <img src={getImageUrl(food.HinhAnh)} alt={food.TenMon} />
            </div>
            
            <div className="food-detail-info">
              <h1 className="food-title">{food.TenMon}</h1>
              <div className="food-category-badge">{food.TenDanhMuc || "Món ăn"}</div>
              
              <div className="food-price-box">
                <span className="price-label">Giá:</span>
                <span className="price-value">{Number(food.Gia).toLocaleString('vi-VN')} VNĐ</span>
              </div>
              
              <div className="food-description">
                <h3>Mô tả món ăn:</h3>
                <p>{food.MoTa || "Chưa có mô tả cho món ăn này."}</p>
              </div>
              
              <div className="food-action-box">
                <div style={{ marginBottom: '15px', fontSize: '15px', color: '#868e96' }}>
                  Số lượng còn: <strong>{food.SoLuong !== undefined ? food.SoLuong : 'Không giới hạn'}</strong>
                </div>
                <div className="quantity-selector">
                  <span>Số lượng:</span>
                  <div className="quantity-controls">
                    <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="btn-qty" disabled={food.SoLuong === 0}>-</button>
                    <input type="number" value={food.SoLuong === 0 ? 0 : quantity} readOnly />
                    <button onClick={() => setQuantity(q => (food.SoLuong !== undefined && q >= food.SoLuong) ? q : q + 1)} className="btn-qty" disabled={food.SoLuong === 0 || (food.SoLuong !== undefined && quantity >= food.SoLuong)}>+</button>
                  </div>
                </div>
                
                <div className="total-price">
                  <span>Tạm tính:</span>
                  <span className="total-val">{(Number(food.Gia) * (food.SoLuong === 0 ? 0 : quantity)).toLocaleString('vi-VN')} VNĐ</span>
                </div>
                
                <button 
                  className="btn-add-to-cart-large" 
                  onClick={addToCart} 
                  disabled={food.SoLuong === 0}
                  style={food.SoLuong === 0 ? { background: '#adb5bd', cursor: 'not-allowed', boxShadow: 'none' } : {}}
                >
                  <i className="fa-solid fa-cart-plus"></i> {food.SoLuong === 0 ? "HẾT HÀNG" : "THÊM VÀO GIỎ HÀNG"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {toastMessage && (
        <div className="toast-notification">
          <i className="fa-solid fa-circle-check"></i>
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default FoodDetail;
