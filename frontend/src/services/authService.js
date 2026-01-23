// ============================================
// FILE: authService.js
// MỤC ĐÍCH: Chứa các hàm gọi API liên quan đến Authentication
// SO SÁNH: Giống AuthService.java trong Spring Boot
// ============================================

// Import instance axios đã cấu hình
import api from './api';

// ============================================
// HÀM 1: login(username, password)
// ============================================
// MỤC ĐÍCH: Gọi API đăng nhập
// THAM SỐ: username, password (từ form login)
// TRẢ VỀ: Promise chứa response từ server
//
// SO SÁNH VỚI SPRING BOOT:
// - Giống như gọi: POST /api/auth/login với body {username, password}
// - Backend AuthController.java sẽ nhận request này
//
export const login = async (username, password) => {
    // ========== GIẢI THÍCH TỪNG PHẦN ==========

    // 1. async/await: Cách viết code bất đồng bộ (asynchronous)
    //    - API call mất thời gian → không muốn "đứng chờ"
    //    - async: Đánh dấu hàm này là bất đồng bộ
    //    - await: "Đợi" cho đến khi có kết quả

    // 2. try/catch: Bắt lỗi (giống try-catch trong Java)
    try {
        // 3. api.post(): Gửi POST request
        //    - Tham số 1: Endpoint (đường dẫn API)
        //    - Tham số 2: Body (dữ liệu gửi đi)
        const response = await api.post('/auth/login', {
            username: username,  // hoặc viết tắt: username,
            password: password,  // hoặc viết tắt: password,
        });

        // 4. response.data: Dữ liệu server trả về
        //    Cấu trúc (từ LoginResponse.java):
        //    {
        //        token: "eyJhbGciOiJIUzI1NiJ9...",
        //        type: "Bearer",
        //        id: 1,
        //        username: "admin",
        //        email: "admin@example.com",
        //        fullname: "Administrator",
        //        roles: ["ROLE_ADMIN"]
        //    }

        // sau khi back end trả dữ liệu sẽ đến bước này
        const data = response.data;

        // 5. Lưu token và user vào localStorage
        //    - localStorage: Bộ nhớ trên browser, tồn tại cả khi đóng tab
        //    - Mục đích: Giữ trạng thái đăng nhập
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            // JSON.stringify: Chuyển object → string (localStorage chỉ lưu string)
            //localStorage chỉ lưu được string
        }

        // 6. Trả về data để component sử dụng
        return data;

    } catch (error) {
        // 7. Xử lý lỗi
        //    - error.response.data: Message lỗi từ server
        //    - Ví dụ: "Username không tồn tại!" hoặc "Password không đúng!"
        console.error('Login error:', error);

        // Throw lỗi để component bắt và hiển thị cho user
        throw error.response?.data || 'Đăng nhập thất bại!';
    }
};

// ============================================
// HÀM 2: logout()
// ============================================
// MỤC ĐÍCH: Đăng xuất - xóa token khỏi localStorage
//
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Sau khi xóa, user sẽ phải đăng nhập lại
};

// ============================================
// HÀM 3: getCurrentUser()
// ============================================
// MỤC ĐÍCH: Lấy thông tin user đang đăng nhập
// TRẢ VỀ: Object user hoặc null
//
export const getCurrentUser = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        // JSON.parse: Chuyển string → object (ngược với JSON.stringify)
        return JSON.parse(userStr);
    }
    return null;
};

// ============================================
// HÀM 4: isAuthenticated()
// ============================================
// MỤC ĐÍCH: Kiểm tra user đã đăng nhập chưa
// TRẢ VỀ: true/false
//
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if(!token)
    {
    return false ;
    }
    return true;

    // Có token → đã đăng nhập
    // Không có token → chưa đăng nhập
};

// ============================================
// HÀM 5: getToken()
// ============================================
// MỤC ĐÍCH: Lấy JWT token
// DÙNG KHI: Cần gắn token vào header để gọi API khác
//
export const getToken = () => {
    return localStorage.getItem('token');
};