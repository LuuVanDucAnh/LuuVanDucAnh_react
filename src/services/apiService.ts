import axiosClient from '../utils/api';

// ============================================================
// TYPE DEFINITIONS
// ============================================================

// Auth
export interface RegisterPayload {
  username: string;
  password: string;
  hoTen: string;
  soDienThoai?: string;
  diaChi?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface UserInfo {
  maTK: number;
  username: string;
  vaiTro: 'Admin' | 'NhanVien' | 'Shipper' | 'KhachHang';
  hoTen?: string;
  maKhachHang?: number;
  maNhanVien?: number;
  maShipper?: number;
  NgayTao?: string;
  BienSoXe?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: UserInfo;
}

// Foods / Restaurant
export interface Restaurant {
  MaNhaHang: number;
  TenNhaHang: string;
  DiaChi: string;
  SoDienThoai: string;
  HinhAnh: string;
  MinOrder: number;
  MaCode: string;
}

export interface Category {
  MaDanhMuc: number;
  TenDanhMuc: string;
  monAn?: Food[];
}

export interface Food {
  MaMonAn: number;
  TenMon: string;
  Gia: number;
  MoTa: string;
  HinhAnh: string;
  MaDanhMuc: number;
  SoLuong?: number;
  TenDanhMuc?: string;
}

// Orders
export interface OrderItem {
  MaChiTiet?: number;
  MaMonAn: number;
  TenMon?: string;
  SoLuong: number;
  DonGia?: number;
  ThanhTien?: number;
}

export interface Order {
  MaDonHang: number;
  MaKhachHang: number;
  MaShipper?: number;
  MaNhaHang?: number;
  NgayDat: string;
  NgayGiao?: string;
  DiaChiGiao: string;
  GhiChu?: string;
  TongTien: number;
  PhiShip: number;
  PhuongThucThanhToan: string;
  TrangThaiThanhToan: string;
  TrangThai: string;
  TenKhachHang?: string;
  TenShipper?: string;
  TenNhaHang?: string;
  KhachHangSDT?: string;
  ShipperSDT?: string;
  items?: OrderItem[];
}

export interface CreateOrderPayload {
  maKhachHang: number;
  maNhaHang: number;
  diaChiGiao: string;
  ghiChu?: string;
  phuongThucThanhToan: string;
  items: { maMonAn: number; soLuong: number }[];
}

// Shipping
export interface ShipperProfile {
  MaShipper: number;
  HoTen: string;
  BienSoXe: string;
  SoDienThoai: string;
  Username?: string;
  NgayTao?: string;
  SoDonDaGiao: number;
}

// Admin
export interface AdminStats {
  stats: {
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    customers: number;
    shippers: number;
    staff: number;
  };
  todayOrders: number;
  todayRevenue: number;
  monthlyStats: { Thang: number; Nam: number; SoDon: number; DoanhThu: number }[];
}

export interface AdminUser {
  MaTK: number;
  Username: string;
  VaiTro: string;
  NgayTao: string;
  MaKhachHang?: number;
  HoTen?: string;
  SoDienThoai?: string;
  DiaChi?: string;
  MaNhanVien?: number;
  MaShipper?: number;
  BienSoXe?: string;
  ShipperSDT?: string;
}

export interface TopFood {
  MaMonAn: number;
  TenMon: string;
  Gia: number;
  HinhAnh: string;
  TenDanhMuc: string;
  SoLanDat: number;
  TongSoLuong: number;
  TongDoanhThu: number;
}

export interface TopShipper {
  MaShipper: number;
  HoTen: string;
  BienSoXe: string;
  SoDienThoai: string;
  TongDon: number;
  DonDaGiao: number;
  DonDangGiao: number;
  TongPhiShip: number;
}

// ============================================================
// AUTH SERVICE
// ============================================================

export const authService = {
  register: async (payload: RegisterPayload) => {
    const res = await axiosClient.post('/auth/register', payload);
    return res.data as { message: string; token: string; user: UserInfo };
  },

  login: async (payload: LoginPayload) => {
    const res = await axiosClient.post('/auth/login', {
      username: payload.username,
      password: payload.password,
    });
    return res.data as AuthResponse;
  },

  refreshToken: async () => {
    const res = await axiosClient.post('/auth/refresh-token');
    return res.data as { token: string; user: UserInfo };
  },

  getProfile: async () => {
    const res = await axiosClient.get('/auth/profile');
    return res.data as { user: UserInfo };
  },

  updateProfile: async (payload: {
    hoTen: string;
    soDienThoai?: string;
    diaChi?: string;
  }) => {
    const res = await axiosClient.put('/auth/profile', payload);
    return res.data as { message: string };
  },

  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const res = await axiosClient.put('/auth/change-password', payload);
    return res.data as { message: string };
  },
};

// ============================================================
// FOODS / RESTAURANT SERVICE
// ============================================================

export const foodsService = {
  getRestaurant: async () => {
    const res = await axiosClient.get('/foods/restaurant');
    return res.data as { restaurants: Restaurant[] };
  },

  getMenu: async () => {
    const res = await axiosClient.get('/foods/menu');
    return res.data as { menu: Category[] };
  },

  getFoods: async () => {
    const res = await axiosClient.get('/foods/foods');
    return res.data as { foods: Food[] };
  },

  getFoodsByCategory: async (maDanhMuc: number) => {
    const res = await axiosClient.get(`/foods/menu/${maDanhMuc}`);
    return res.data as { foods: Food[] };
  },

  getFoodDetail: async (id: number) => {
    const res = await axiosClient.get(`/foods/foods/${id}`);
    return res.data as { food: Food };
  },

  searchFoods: async (params: { q?: string; maDanhMuc?: number }) => {
    const res = await axiosClient.get('/foods/foods/search', { params });
    return res.data as { foods: Food[] };
  },

  validateOrder: async (payload: {
    items: { maMonAn: number; soLuong: number }[];
    diaChiGiao: string;
  }) => {
    const res = await axiosClient.post('/foods/validate-order', payload);
    return res.data as {
      valid: boolean;
      minOrder: number;
      subtotal: number;
      phiShip: number;
      tongTien: number;
      items: { maMonAn: number; tenMon: string; donGia: number; soLuong: number; thanhTien: number }[];
      restaurant: { tenNhaHang: string; diaChi: string };
    };
  },
};

// ============================================================
// ORDERS SERVICE
// ============================================================

export const ordersService = {
  create: async (payload: CreateOrderPayload) => {
    const res = await axiosClient.post('/orders', payload);
    return res.data as { message: string; order: Order };
  },

  getMyOrders: async () => {
    const res = await axiosClient.get('/orders');
    return res.data as { orders: Order[] };
  },

  getOrderById: async (id: number) => {
    const res = await axiosClient.get(`/orders/${id}`);
    return res.data as { order: Order };
  },

  cancel: async (id: number) => {
    const res = await axiosClient.put(`/orders/${id}/cancel`);
    return res.data as { message: string };
  },

  confirmPayment: async (id: number) => {
    const res = await axiosClient.put(`/orders/${id}/confirm-payment`);
    return res.data as { message: string };
  },
};

// ============================================================
// RESTAURANT (NhanVien) SERVICE
// ============================================================

export const restaurantService = {
  getOrders: async (params?: { status?: string; page?: number; limit?: number }) => {
    const res = await axiosClient.get('/restaurant/orders', { params });
    return res.data as { orders: Order[]; total: number; page: number; limit: number };
  },

  confirmOrder: async (id: number) => {
    const res = await axiosClient.put(`/restaurant/orders/${id}/confirm`);
    return res.data as { message: string };
  },

  readyOrder: async (id: number) => {
    const res = await axiosClient.put(`/restaurant/orders/${id}/ready`);
    return res.data as { message: string };
  },

  rejectOrder: async (id: number, lyDo?: string) => {
    const res = await axiosClient.put(`/restaurant/orders/${id}/reject`, { lyDo });
    return res.data as { message: string; lyDo: string };
  },
};

// ============================================================
// SHIPPING SERVICE
// ============================================================

export const shippingService = {
  getPendingOrders: async (params?: { page?: number; limit?: number }) => {
    const res = await axiosClient.get('/shipping/pending', { params });
    return res.data as { orders: Order[]; total: number; page: number; limit: number };
  },

  getMyTasks: async () => {
    const res = await axiosClient.get('/shipping/my-tasks');
    return res.data as { orders: Order[] };
  },

  getProfile: async () => {
    const res = await axiosClient.get('/shipping/profile');
    return res.data as { shipper: ShipperProfile };
  },

  receiveOrder: async (id: number) => {
    const res = await axiosClient.put(`/shipping/${id}/receive`);
    return res.data as { message: string };
  },

  completeOrder: async (id: number) => {
    const res = await axiosClient.put(`/shipping/${id}/complete`);
    return res.data as { message: string; ngayGiao: string };
  },

  cancelDelivery: async (id: number, lyDo?: string) => {
    const res = await axiosClient.put(`/shipping/${id}/cancel-delivery`, { lyDo });
    return res.data as { message: string; lyDo: string };
  },
};

// ============================================================
// ADMIN SERVICE
// ============================================================

export const adminService = {
  // Dashboard & Stats
  getDashboardStats: async () => {
    const res = await axiosClient.get('/admin/stats');
    return res.data as AdminStats;
  },

  getTopFoods: async (params?: { limit?: number; startDate?: string; endDate?: string }) => {
    const res = await axiosClient.get('/admin/top-foods', { params });
    return res.data as { topFoods: TopFood[] };
  },

  getTopShippers: async (params?: { limit?: number }) => {
    const res = await axiosClient.get('/admin/top-shippers', { params });
    return res.data as { topShippers: TopShipper[] };
  },

  getRevenueStats: async (params?: { period?: 'day' | 'week' | 'month'; year?: number }) => {
    const res = await axiosClient.get('/admin/revenue-stats', { params });
    return res.data as {
      revenueStats: { Label: string | number; SoDon: number; DoanhThu: number }[];
      period: string;
      year: number;
    };
  },

  // Orders
  getAllOrders: async (params?: { status?: string; page?: number; limit?: number }) => {
    const res = await axiosClient.get('/admin/orders', { params });
    return res.data as { orders: Order[]; total: number; page: number; limit: number };
  },

  assignShipper: async (orderId: number, maShipper: number) => {
    const res = await axiosClient.put(`/admin/orders/${orderId}/assign-shipper`, { maShipper });
    return res.data as { message: string };
  },

  cancelOrderByAdmin: async (orderId: number) => {
    const res = await axiosClient.put(`/admin/orders/${orderId}/cancel`);
    return res.data as { message: string };
  },

  // Users
  getAllUsers: async (params?: { vaiTro?: string; page?: number; limit?: number }) => {
    const res = await axiosClient.get('/admin/users', { params });
    return res.data as { users: AdminUser[]; total: number; page: number; limit: number };
  },

  createUser: async (payload: {
    username: string;
    password: string;
    vaiTro: 'NhanVien' | 'Shipper';
    hoTen: string;
    soDienThoai?: string;
    diaChi?: string;
    bienSoXe?: string;
  }) => {
    const res = await axiosClient.post('/admin/users', payload);
    return res.data as { message: string; maTK: number };
  },

  updateUser: async (
    userId: number,
    payload: {
      hoTen?: string;
      soDienThoai?: string;
      diaChi?: string;
      bienSoXe?: string;
    }
  ) => {
    const res = await axiosClient.put(`/admin/users/${userId}`, payload);
    return res.data as { message: string };
  },

  resetPassword: async (userId: number, newPassword: string) => {
    const res = await axiosClient.put(`/admin/users/${userId}/reset-password`, { newPassword });
    return res.data as { message: string };
  },

  deleteUser: async (userId: number) => {
    const res = await axiosClient.delete(`/admin/users/${userId}`);
    return res.data as { message: string };
  },

  // Restaurant
  getRestaurant: async () => {
    const res = await axiosClient.get('/admin/restaurant');
    return res.data as { restaurant: Restaurant };
  },

  updateRestaurant: async (payload: {
    tenNhaHang?: string;
    diaChi?: string;
    soDienThoai?: string;
    hinhAnh?: string;
    minOrder?: number;
    maCode?: string;
  }) => {
    const res = await axiosClient.put('/admin/restaurant', payload);
    return res.data as { message: string };
  },

  // Categories
  getCategories: async () => {
    const res = await axiosClient.get('/admin/categories');
    return res.data as { categories: { MaDanhMuc: number; TenDanhMuc: string; SoMonAn: number }[] };
  },

  createCategory: async (tenDanhMuc: string) => {
    const res = await axiosClient.post('/admin/categories', { tenDanhMuc });
    return res.data as { message: string; maDanhMuc: number };
  },

  updateCategory: async (id: number, tenDanhMuc: string) => {
    const res = await axiosClient.put(`/admin/categories/${id}`, { tenDanhMuc });
    return res.data as { message: string };
  },

  deleteCategory: async (id: number) => {
    const res = await axiosClient.delete(`/admin/categories/${id}`);
    return res.data as { message: string };
  },

  // Foods
  getFoodsAdmin: async () => {
    const res = await axiosClient.get('/admin/foods');
    return res.data as { foods: Food[] };
  },

  createFood: async (payload: {
    tenMon: string;
    gia: number;
    moTa?: string;
    hinhAnh?: string;
    maDanhMuc: number;
    soLuong?: number;
  }) => {
    const res = await axiosClient.post('/admin/foods', payload);
    return res.data as { message: string; maMonAn: number };
  },

  updateFood: async (
    id: number,
    payload: {
      tenMon?: string;
      gia?: number;
      moTa?: string;
      hinhAnh?: string;
      maDanhMuc?: number;
      soLuong?: number;
    }
  ) => {
    const res = await axiosClient.put(`/admin/foods/${id}`, payload);
    return res.data as { message: string };
  },

  deleteFood: async (id: number) => {
    const res = await axiosClient.delete(`/admin/foods/${id}`);
    return res.data as { message: string };
  },
};
