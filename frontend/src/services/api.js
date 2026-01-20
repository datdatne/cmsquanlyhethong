import axios from 'axios';

// Base URL của backend
const API_BASE_URL = 'http://localhost:8080/api';

// Tạo instance axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để tự động thêm token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            //them token vao authorization
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api; // export là cho phép file khác dùng file này
// config chứa toàn bộ thông tin của request bao gồm url,header,method,data
