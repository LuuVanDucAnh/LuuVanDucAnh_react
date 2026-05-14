import React, { useState, useEffect } from "react";
import { CartItem, getTotal } from "../utils/cart";
import "../assets/css/style_checkout.css";

type CheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onSubmitOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    paymentMethod: string;
    orderNote: string;
  }) => void;
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cart, onSubmitOrder }) => {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderNote, setOrderNote] = useState("");

  useEffect(() => {
    if (isOpen) {
      const userStr = localStorage.getItem("currentUser");
      if (userStr) {
        const user = JSON.parse(userStr);
        setCustomerName(user.hoTen || user.fullname || "");
        setCustomerPhone(user.soDienThoai || user.phone || "");
        setCustomerAddress(user.diaChi || user.address || "");
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitOrder({
      customerName,
      customerPhone,
      customerAddress,
      paymentMethod,
      orderNote,
    });
  };

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content order-form-modal" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal" onClick={onClose}>&times;</span>

        <h2 className="checkout-title">
          <i className="fa-solid fa-clipboard-list"></i> Thông tin đặt hàng
        </h2>

        <form id="orderForm" className="order-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customer-name">
              <i className="fa-solid fa-user"></i> Họ và tên <span className="required">*</span>
            </label>
            <input
              type="text"
              id="customer-name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              placeholder="Nhập họ và tên của bạn"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customer-phone">
              <i className="fa-solid fa-phone"></i> Số điện thoại <span className="required">*</span>
            </label>
            <input
              type="tel"
              id="customer-phone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customer-address">
              <i className="fa-solid fa-location-dot"></i> Địa chỉ giao hàng <span className="required">*</span>
            </label>
            <textarea
              id="customer-address"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              required
              rows={3}
              placeholder="Nhập địa chỉ giao hàng chi tiết"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="payment-method">
              <i className="fa-solid fa-credit-card"></i> Phương thức thanh toán <span className="required">*</span>
            </label>
            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            >
              <option value="">Chọn phương thức thanh toán</option>
              <option value="cash">Thanh toán khi nhận hàng (COD)</option>
              <option value="bank">Chuyển khoản ngân hàng</option>
              <option value="momo">Ví MoMo</option>
              <option value="zalopay">Ví ZaloPay</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="order-note">
              <i className="fa-solid fa-note-sticky"></i> Ghi chú (tùy chọn)
            </label>
            <textarea
              id="order-note"
              value={orderNote}
              onChange={(e) => setOrderNote(e.target.value)}
              rows={2}
              placeholder="Ghi chú thêm cho đơn hàng..."
            ></textarea>
          </div>

          <div className="order-summary">
            <h3>Tóm tắt đơn hàng</h3>
            <div id="order-summary-content">
              {cart.map((item, index) => (
                <div className="summary-item" key={index}>
                  <span>{item.quantity}x {item.name}</span>
                  <span>{(item.price * item.quantity).toLocaleString("vi-VN")}đ</span>
                </div>
              ))}
            </div>
            <div className="order-total-summary">
              <strong>Tổng tiền: <span className="total-amount">{getTotal(cart).toLocaleString("vi-VN")} VNĐ</span></strong>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="btn-submit-order">
              <i className="fa-solid fa-check"></i> Xác nhận đặt hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
