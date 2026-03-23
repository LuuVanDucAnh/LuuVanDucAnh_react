export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// Lấy giỏ hàng
export const getCart = (): CartItem[] => {
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

// Lưu giỏ hàng
export const saveCart = (cart: CartItem[]) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Tổng tiền
export const getTotal = (cart: CartItem[]) => {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
};