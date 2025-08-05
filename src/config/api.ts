import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api` || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// Xác thực ở trang admin
// Interceptor: Gắn token vào mọi request

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token && !config.headers?.Authorization) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Bắt lỗi 401 để gọi refreshToken và gửi lại request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await refreshInstance.get('/auth/refreshToken', {
          params: {
            refreshToken: localStorage.getItem('refreshToken')
          }
        });
        const newAccessToken = res.data.accessToken;

        // Cập nhật localStorage và biến bộ nhớ tạm
        localStorage.setItem('accessToken', newAccessToken);

        // Gắn token mới và gửi lại request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Token không còn hợp lệ, xóa token và báo lỗi
        localStorage.removeItem('accessToken');
        // (Tùy chọn) Redirect về trang login tại đây
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api; 