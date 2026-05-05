export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantName?: string;
  maNhaHang?: number;
}

// Lấy giỏ hàng
export const getCart = (): CartItem[] => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

// Lưu giỏ hàng
export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
};

// Tổng tiền
export const getTotal = (cart: CartItem[]) => {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};