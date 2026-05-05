import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CheckoutModal from "../components/CheckoutModal";
import { CartItem, getCart, saveCart, getTotal } from "../utils/cart";
import axiosClient from "../utils/api";
import "../assets/css/style_cart.css";

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const navigate = useNavigate();

  // Load dữ liệu và kiểm tra đăng nhập
  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      if (window.confirm('Bạn cần đăng nhập để xem giỏ hàng và đặt hàng. Bạn có muốn chuyển đến trang đăng nhập không?')) {
        navigate('/login');
      } else {
        navigate('/');
      }
      return;
    }

    setCart(getCart());
  }, [navigate]);

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
                    <button className="btn_order" onClick={() => setIsCheckoutModalOpen(true)}>
                      Thanh toán
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        onSubmitOrder={async (orderData) => {
          try {
            const requestBody = {
              maNhaHang: cart[0]?.maNhaHang || 0,
              diaChiGiao: orderData.customerAddress,
              ghiChu: orderData.orderNote,
              phuongThucThanhToan: orderData.paymentMethod === "cash" ? "TienMat" : "ChuyenKhoan",
              gioHang: cart.map(item => ({
                maMonAn: parseInt(item.id),
                soLuong: item.quantity
              }))
            };

            const res = await axiosClient.post('/orders/Order/taodonhang', requestBody);
            
            if (res.data.success) {
              alert("Đặt hàng thành công! Đơn hàng của bạn đang được xử lý.");
              setCart([]);
              localStorage.removeItem("cart");
              window.dispatchEvent(new Event("cartUpdated"));
              setIsCheckoutModalOpen(false);
              navigate("/my-orders");
            } else {
              alert(res.data.message || "Đặt hàng thất bại");
            }
          } catch (error: any) {
            console.error("Lỗi đặt hàng:", error);
            alert(error.response?.data?.message || "Có lỗi xảy ra khi đặt hàng");
          }
        }}
      />
    </>
  );
};

export default Cart;