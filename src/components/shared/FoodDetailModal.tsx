import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/image";
import { getCart, saveCart } from "../../utils/cart";
import { Food } from "../../services/apiService";
import "../../assets/css/style_modal.css";

interface FoodDetailModalProps {
  food: Food | null;
  onClose: () => void;
  onAdded?: () => void;
}

const FoodDetailModal: React.FC<FoodDetailModalProps> = ({ food, onClose, onAdded }) => {
  const [quantity, setQuantity] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (food) setQuantity(1);
  }, [food]);

  if (!food) return null;

  const addToCart = (f: Food, qty: number = 1) => {
    const currentCart = getCart();
    if (currentCart.length > 0 && currentCart[0].maNhaHang !== f.MaNhaHang) {
      setToastMessage(`Giỏ hàng chỉ chứa món từ 1 nhà hàng. Vui lòng xóa giỏ hàng trước!`);
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }
    const existingItem = currentCart.find((item) => item.id === String(f.MaMonAn));
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      currentCart.push({
        id: String(f.MaMonAn),
        name: f.TenMon,
        price: f.Gia,
        image: f.HinhAnh,
        quantity: qty,
        restaurantName: "DA Food",
        maNhaHang: f.MaNhaHang,
      });
    }
    saveCart(currentCart);
    setToastMessage(`Đã thêm ${qty} x ${f.TenMon} vào giỏ hàng`);
    setTimeout(() => setToastMessage(null), 3000);
    window.dispatchEvent(new Event("cartUpdated"));
    if (onAdded) onAdded();
  };

  const isOutOfStock = food.SoLuong === 0;
  const maxQty = food.SoLuong !== undefined ? food.SoLuong : 999;

  return (
    <>
      <div className="modal" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close-modal" onClick={onClose}>&times;</span>
          <h2>{food.TenMon}</h2>
          <hr className="modal-divider" />
          <div className="modal-body">
            <div className="modal-image">
              <img
                src={getImageUrl(food.HinhAnh)}
                alt={food.TenMon}
                onClick={() => { onClose(); navigate(`/food/${food.MaMonAn}`); }}
                style={{ cursor: 'pointer' }}
              />
            </div>
            <div className="modal-info">
              <p className="modal-price">
                Giá: <span>{Number(food.Gia).toLocaleString('vi-VN')} VNĐ</span>
              </p>
              <p className="modal-desc">
                Mô tả: <i>{food.MoTa || "Không có mô tả"}</i>
              </p>
              <div className="modal-quantity-section">
                <span>Số lượng:</span>
                <div style={{ fontSize: '14px', color: '#868e96', marginLeft: 'auto', marginRight: '15px' }}>
                  Còn: <strong>{food.SoLuong !== undefined ? food.SoLuong : 'Không giới hạn'}</strong>
                </div>
                <div className="modal-quantity">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="btn-qty" disabled={isOutOfStock}>-</button>
                  <input type="number" value={isOutOfStock ? 0 : quantity} readOnly />
                  <button onClick={() => setQuantity(q => Math.min(maxQty, q + 1))} className="btn-qty" disabled={isOutOfStock || quantity >= maxQty}>+</button>
                </div>
              </div>
              <div className="modal-total">
                Thành tiền: <span>{(Number(food.Gia) * (isOutOfStock ? 0 : quantity)).toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <button
                className="btn-add-cart"
                onClick={() => { addToCart(food, quantity); onClose(); }}
                disabled={isOutOfStock}
                style={isOutOfStock ? { background: '#adb5bd', cursor: 'not-allowed', boxShadow: 'none' } : {}}
              >
                {isOutOfStock ? "HẾT HÀNG" : "THÊM VÀO GIỎ HÀNG"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="toast-notification">
          <i className="fa-solid fa-circle-check"></i>
          {toastMessage}
        </div>
      )}
    </>
  );
};

export default FoodDetailModal;
