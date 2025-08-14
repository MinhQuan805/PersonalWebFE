import axios from 'axios';
import Cookies from 'js-cookie';

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:8080/api';

// Tạo instance chung với baseURL
const api = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Gắn token từ cookie vào mọi request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = Cookies.get('accessToken');
      if (token && !config.headers?.Authorization) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Xử lý lỗi 401 và refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== 'undefined' // Đảm bảo chạy trên client
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = Cookies.get('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');

        // Gửi refresh token qua POST để bảo mật
        const res = await api.post('/auth/refreshToken', {
          refreshToken,
        }, {
          // Tránh gửi token cũ trong header khi refresh
          headers: { Authorization: undefined },
        });

        const newAccessToken = res.data.accessToken;

        // Cập nhật cookie
        Cookies.set('accessToken', newAccessToken, { path: '/', sameSite: 'strict' });
        Cookies.set('refreshToken', res.data.refreshToken || refreshToken, { path: '/', sameSite: 'strict', httpOnly: true }); // Có thể thêm httpOnly cho refreshToken

        // Gắn token mới và gửi lại request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Xóa token và redirect về login khi refresh thất bại
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/auth/login'; // Redirect thủ công
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;