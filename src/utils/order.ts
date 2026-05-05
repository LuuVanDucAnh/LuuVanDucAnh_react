export type OrderItem = {
    name: string;
    quantity: number;
    price: number;
    image?: string;
};

export type Order = {
    id: string;
    date: string;
    status: string;
    total: number;
    restaurant: string;
    items: OrderItem[];
    customerName: string;
    phone: string;
    address: string;
    note: string;
    payment: string;
};

const ORDERS_KEY = "user_orders";

export const getOrders = (): Order[] => {
    const orders = localStorage.getItem(ORDERS_KEY);
    return orders ? JSON.parse(orders) : [];
};

export const saveOrders = (orders: Order[]) => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const addOrder = (order: Order) => {
    const orders = getOrders();
    orders.unshift(order); // Thêm vào đầu danh sách
    saveOrders(orders);
};

export const generateOrderId = () => {
    return "ORD" + Date.now().toString().slice(-8);
};

export const formatDateTime = (date: Date) => {
    const d = new Date(date);
    const time = d.toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' });
    const day = d.toLocaleDateString("vi-VN");
    return `${time} ${day}`;
};
