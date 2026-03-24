import { useEffect, useState } from "react";
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
    <div className="cart_page">
      <h2>Giỏ hàng của bạn</h2>

      {cart.length === 0 ? (
        <p>Giỏ hàng trống</p>
      ) : (
        <>
          <table className="cart_table">
            <thead>
              <tr>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tổng</th>
                <th>Xóa</th>
              </tr>
            </thead>

            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>
                    <img src={item.image} alt={item.name} width={60} />
                  </td>

                  <td>{item.name}</td>

                  <td>{item.price.toLocaleString()}đ</td>

                  <td>
                    <button onClick={() => decrease(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increase(item.id)}>+</button>
                  </td>

                  <td>
                    {(item.price * item.quantity).toLocaleString()}đ
                  </td>

                  <td>
                    <button onClick={() => removeItem(item.id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart_total">
            <h3>
              Tổng tiền: {getTotal(cart).toLocaleString()}đ
            </h3>

            <button className="btn_checkout">
              Thanh toán
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;