import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CheckoutModal from "../components/CheckoutModal";
import { CartItem, getCart, saveCart, getTotal } from "../utils/cart";
import { ordersService } from "../services/apiService";
import "../assets/css/style_cart.css";

const Cart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const handleCartUpdate = () => setCart(getCart());
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    saveCart(newCart);
  };

  const increase = (id: string) => {
    updateCart(cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrease = (id: string) => {
    updateCart(cart.map(item =>
      item.id === id ? { ...item, quantity: item.quantity - 1 } : item
    ).filter(item => item.quantity > 0));
  };

  const removeItem = (id: string) => {
    updateCart(cart.filter(item => item.id !== id));
  };

  const handleCheckout = async (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: string;
    orderNote: string;
  }) => {
    const user = JSON.parse(localStorage.getItem("currentUser") || '{}');
    if (!user.maKhachHang) {
      alert("Không tìm thấy thông tin khách hàng. Vui lòng đăng nhập lại.");
      return;
    }

    if (!orderData.customerAddress) {
      alert("Vui lòng nhập địa chỉ giao hàng!");
      return;
    }

    setLoading(true);

    try {
      const phuongThuc = orderData.paymentMethod === "cash" ? "TienMat"
        : orderData.paymentMethod === "bank" ? "ChuyenKhoan"
        : orderData.paymentMethod === "momo" ? "MoMo"
        : orderData.paymentMethod === "zalopay" ? "ZaloPay"
        : "TienMat";

      const res = await ordersService.create({
        maKhachHang: user.maKhachHang,
        diaChiGiao: orderData.customerAddress,
        ghiChu: orderData.orderNote || '',
        phuongThucThanhToan: phuongThuc,
        items: cart.map(item => ({
          maMonAn: parseInt(item.id),
          soLuong: item.quantity,
        })),
        maNhaHang: cart[0]?.maNhaHang || 1,
      });

      alert(res.message || "Đặt hàng thành công!");
      saveCart([]);
      navigate("/my-orders");
    } catch (error: any) {
      console.error("Lỗi đặt hàng:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi đặt hàng!");
    } finally {
      setLoading(false);
    }
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
                        <button onClick={() => removeItem(item.id)}>Xóa</button>
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
                    <button
                      className="btn_order"
                      onClick={() => setIsCheckoutModalOpen(true)}
                      disabled={loading}
                    >
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
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => { setIsCheckoutModalOpen(false); setLoading(false); }}
        cart={cart}
        onSubmitOrder={handleCheckout}
      />
    </>
  );
};

export default Cart;
