import { useState } from "react";

const OrderModal = () => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-modal">&times;</span>

        <h2>Tàu hũ chiên giòn</h2>

        <div className="modal-body">
          <div className="modal-image">
            <img src="" alt="product" />
          </div>

          <div className="modal-info">
            <p>Giá: 30.000 VNĐ</p>

            <div className="modal-quantity">
              <button onClick={() => setQuantity(quantity - 1)}>-</button>
              <input value={quantity} readOnly />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>

            <button>Thêm vào giỏ hàng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;