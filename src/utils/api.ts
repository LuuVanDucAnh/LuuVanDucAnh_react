import axios from 'axios';

// Thay đổi URL và cổng này thành URL chạy API thật của bạn
const BASE_URL = 'http://localhost:60875'; 

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor request: Tự động đính kèm Token vào mỗi Request gửi đi
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (hoặc currentUser nếu bạn lưu token trong đó)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor response: Xử lý lỗi chung khi nhận response (ví dụ token hết hạn)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý lỗi 401 Unauthorized (Chưa đăng nhập hoặc token hết hạn)
    if (error.response && error.response.status === 401) {
      console.error("Phiên đăng nhập đã hết hạn hoặc bạn không có quyền truy cập.");
      // Tuỳ chọn: Tự động logout và điều hướng về trang đăng nhập
      // localStorage.removeItem('token');
      // localStorage.removeItem('currentUser');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
