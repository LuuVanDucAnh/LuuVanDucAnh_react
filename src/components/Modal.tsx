import { useState, useEffect } from "react";
import "../assets/css/style_modal.css";

// Kiểu Dish mới từ API
export type Dish = {
  maMonAn: number;
  tenMon: string;
  moTa: string;
  gia: number;
  hinhAnh: string;
  maDanhMuc?: number;
};

type OrderModalProps = {
  dish: Dish | null;
  onClose: () => void;
  onAddToCart: (dish: Dish, quantity: number) => void;
};

const OrderModal = ({ dish, onClose, onAddToCart }: OrderModalProps) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (dish) {
      setQuantity(1);
    }
  }, [dish]);

  if (!dish) return null;

  const totalPrice = dish.gia * quantity;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>&times;</span>

        <h2>{dish.tenMon}</h2>
        <hr className="modal-divider" />

        <div className="modal-body">
          <div className="modal-image">
            <img
              src={dish.hinhAnh?.startsWith('http') ? dish.hinhAnh : "https://via.placeholder.com/300x200?text=Mon+An"}
              alt={dish.tenMon}
            />
          </div>

          <div className="modal-info">
            <p className="modal-price">
              Giá: <span>{dish.gia.toLocaleString("vi-VN")} VNĐ</span>
            </p>
            
            <p className="modal-desc">
              Mô tả: <i>{dish.moTa || "Không có mô tả"}</i>
            </p>

            <div className="modal-quantity-section">
              <span>Số lượng:</span>
              <div className="modal-quantity">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="btn-qty"
                >
                  -
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  readOnly 
                />
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="btn-qty"
                >
                  +
                </button>
              </div>
            </div>

            <div className="modal-total">
              Thành tiền: <span>{totalPrice.toLocaleString("vi-VN")} VNĐ</span>
            </div>

            <button 
              className="btn-add-cart" 
              onClick={() => {
                onAddToCart(dish, quantity);
                onClose();
              }}
            >
              THÊM VÀO GIỎ HÀNG
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;