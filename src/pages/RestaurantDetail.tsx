import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { foodsService, Category, Food } from "../services/apiService";
import { getCart, saveCart } from "../utils/cart";
import { getImageUrl } from "../utils/image";
import "../assets/css/style_restaurant.css";
import "../assets/css/style_modal.css";

const RestaurantDetail = () => {
  const location = useLocation();
  const restaurant = location.state?.restaurant;
  const selectedCategory = location.state?.selectedCategory as number | undefined;

  const [menu, setMenu] = useState<Category[]>([]);
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await foodsService.getMenu();
        let categories = res.menu || [];

        if (selectedCategory) {
          categories = categories.filter((c: any) => c.MaDanhMuc === selectedCategory);
        }

        setMenu(categories);
      } catch (error) {
        console.error("Lỗi khi tải thực đơn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [selectedCategory]);

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
        restaurantName: restaurant?.TenNhaHang || "DA Food",
        maNhaHang: restaurant?.MaNhaHang || 1,
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

  return (
    <>
      <Header />
      <div className="main">
        <div className="container">
          {/* Danh sách sản phẩm theo danh mục */}
          {loading ? (
            <p style={{ textAlign: 'center', padding: '50px' }}>Đang tải thực đơn...</p>
          ) : (
            menu.map((cat) => (
              <div className="product" key={cat.MaDanhMuc}>
                <h2 className="product_title" id={`cat_${cat.MaDanhMuc}`}>
                  {cat.TenDanhMuc}
                </h2>
                <div className="productContainer4col">
                  {cat.monAn && cat.monAn.length > 0 ? (
                    cat.monAn.map((food) => (
                      <div className="product_item" key={food.MaMonAn}>
                        <div onClick={() => window.location.href = `/food/${food.MaMonAn}`} style={{ cursor: "pointer" }}>
                          <img
                            src={getImageUrl(food.HinhAnh)}
                            alt={food.TenMon}
                          />
                          <h3>{food.TenMon}</h3>
                        </div>
                        <p className="food-price">{Number(food.Gia).toLocaleString('vi-VN')}đ</p>
                        {food.MoTa && <p className="food-desc">{food.MoTa}</p>}
                        <div className="product-actions">
                          <button onClick={() => { setSelectedFood(food); setQuantity(1); }}>
                            <i className="fa-solid fa-cart-shopping"></i> Đặt hàng
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>Không có món ăn nào trong danh mục này.</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
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
    </>
  );
};

export default RestaurantDetail;
