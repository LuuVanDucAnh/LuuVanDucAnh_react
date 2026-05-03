import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CartItem, getCart, saveCart, getTotal } from "../utils/cart";
import "../assets/css/style_cart.css";

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load dữ liệu
  useEffect(() => {
    setCart(getCart());
  }, []);

  // Cập nhật localStorage
  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    saveCart(newCart);
  };

  // Tăng số lượng
  const increase = (id: string) => {
    const newCart = cart.map(item =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    updateCart(newCart);
  };

  // Giảm số lượng
  const decrease = (id: string) => {
    const newCart = cart
      .map(item =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0);

    updateCart(newCart);
  };

  // Xóa sản phẩm
  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id);
    updateCart(newCart);
  };

  return (
    <>
      <Header />
      <div className="main">
        <div className="container">
          <div className="cart-page">
            <h2 className="cart-title">Giỏ hàng của bạn</h2>

            {cart.length === 0 ? (
              <p className="empty-cart-msg">Giỏ hàng trống. Vui lòng thêm sản phẩm!</p>
            ) : (
              <div className="cart-manager">
                <div id="product-list">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="cart-item-image">
                        <img src={item.image} alt={item.name} />
                      </div>
                      
                      <div className="cart-item-details">
                        <h3>{item.name}</h3>
                        <p>Giá: {item.price.toLocaleString("vi-VN")}đ</p>
                        
                        <div className="quantity-controls">
                          <button onClick={() => decrease(item.id)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => increase(item.id)}>+</button>
                        </div>
                      </div>
                      
                      <div className="cart-item-actions">
                        <button onClick={() => removeItem(item.id)}>
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="total_price">
                  <div className="total_price_text">
                    <h3>Tổng Tiền:</h3>
                    <p>{getTotal(cart).toLocaleString("vi-VN")}đ</p>
                  </div>
                  <div className="total_price_btn">
                    <button className="btn_order">
                      Thanh toán
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;