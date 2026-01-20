// ============================================
// FILE: api.js
// MỤC ĐÍCH: Cấu hình Axios - thư viện gọi HTTP API
// SO SÁNH: Giống như cấu hình RestTemplate trong Spring
// ============================================

// DÒNG 1: Import thư viện axios
// - axios là thư viện giúp gọi HTTP requests (GET, POST, PUT, DELETE)
// - Tương tự HttpClient trong Java
import axios from 'axios';

// DÒNG 2-4: Tạo instance axios với cấu hình mặc định
// - baseURL: Địa chỉ gốc của backend (Spring Boot chạy ở port 8080)
// - Mọi request sẽ tự động thêm baseURL phía trước
// Ví dụ: api.post('/auth/login') → POST http://localhost:8080/api/auth/login
const api = axios.create({
    baseURL: 'http://localhost:8080/api',  // ← Địa chỉ backend của bạn
    headers: {
        'Content-Type': 'application/json',  // ← Gửi dữ liệu dạng JSON
    },
});

// DÒNG 5-20: Interceptor - "Bộ chặn" request trước khi gửi đi
// - Chạy MỖI LẦN trước khi gửi request
// - Mục đích: Tự động gắn JWT token vào header
// SO SÁNH: Giống JwtAuthenticationFilter trong Spring Security
api.interceptors.request.use(
    (config) => {
        // Lấy token từ localStorage (nơi lưu trữ trên browser)
        const token = localStorage.getItem('token');

        // Nếu có token → gắn vào header Authorization
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Request sẽ có header: Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
        }

        // Trả về config để request tiếp tục
        return config;
    },
    (error) => {
        // Nếu có lỗi → trả về Promise.reject để xử lý ở nơi gọi
        return Promise.reject(error);
    }
);

// DÒNG 21-40: Interceptor - "Bộ chặn" response sau khi nhận về
// - Chạy MỖI LẦN sau khi nhận response từ server
// - Mục đích: Xử lý lỗi 401 (Unauthorized) - token hết hạn
api.interceptors.response.use(
    (response) => {
        // Response thành công → trả về bình thường
        return response;
    },
    (error) => {
        // Nếu lỗi 401 (Unauthorized) → token hết hạn hoặc không hợp lệ
        if (error.response && error.response.status === 401) {
            // Xóa token cũ
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Chuyển về trang login
            window.location.href = '/login';
        }

        // Trả về lỗi để component xử lý tiếp
        return Promise.reject(error);
    }
);

// Export để các file khác import sử dụng
// Cách dùng: import api from './services/api';
export default api;