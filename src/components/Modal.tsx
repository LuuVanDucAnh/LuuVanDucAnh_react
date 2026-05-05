import { useState, useEffect } from "react";
import "../assets/css/style_modal.css";

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
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

  const totalPrice = dish.price * quantity;

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>&times;</span>

        <h2>{dish.name}</h2>
        <hr className="modal-divider" />

        <div className="modal-body">
          <div className="modal-image">
            <img src={dish.image} alt={dish.name} />
          </div>

          <div className="modal-info">
            <p className="modal-price">
              Giá: <span>{dish.price.toLocaleString("vi-VN")} VNĐ</span>
            </p>
            
            <p className="modal-desc">
              Mô tả: <i>{dish.description}</i>
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