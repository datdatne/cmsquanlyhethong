// ============================================
// FILE: Login.js
// MỤC ĐÍCH: Component hiển thị form đăng nhập
// ============================================
//
// KHÁI NIỆM QUAN TRỌNG:
// - Component: "Khối giao diện" có thể tái sử dụng (giống 1 class UI)
// - State: Dữ liệu của component (thay đổi → UI cập nhật)
// - Props: Dữ liệu truyền từ component cha xuống con
// ============================================

// ===== PHẦN 1: IMPORTS =====
// Import các hooks từ React
// - useState: Tạo và quản lý state (biến trạng thái)
// - useEffect: Chạy code khi component mount/update (giống @PostConstruct)
import React, { useState } from 'react';

// Import hàm login từ authService
import { login } from '../services/authService';

// Import CSS cho styling
import './Login.css';

// ===== PHẦN 2: COMPONENT FUNCTION =====
// Trong React, component là 1 function trả về JSX (HTML-like syntax)
//
// SO SÁNH VỚI JAVA:
// - Component ≈ Class có phương thức render()
// - JSX ≈ HTML template
// - State ≈ Private fields
//
function Login() {

    // ===== PHẦN 3: KHAI BÁO STATE =====
    // useState() trả về mảng 2 phần tử: [giáTrị, hàmCậpNhật]
    // Cú pháp: const [tênBiến, setTênBiến] = useState(giáTrịBanĐầu);

    // State 1: username - lưu giá trị ô input username
    // - username: giá trị hiện tại (ban đầu = '')
    // - setUsername: hàm để thay đổi giá trị
    const [username, setUsername] = useState('');

    // State 2: password - lưu giá trị ô input password
    const [password, setPassword] = useState('');

    // State 3: error - lưu message lỗi (nếu có)
    const [error, setError] = useState('');

    // State 4: loading - trạng thái đang xử lý (true khi đang gọi API)
    const [loading, setLoading] = useState(false);

    // ===== DEBUG: Đặt breakpoint ở đây trong IntelliJ =====
    // Mỗi lần state thay đổi, component sẽ "re-render"
    // Bạn sẽ thấy console.log này chạy lại
    console.log('=== Login Component Rendered ===');
    console.log('Current state:', { username, password, error, loading });

    // ===== PHẦN 4: EVENT HANDLERS =====
    // Hàm xử lý sự kiện (giống @EventListener trong Java)

    // Hàm xử lý khi form được submit
    // - e: Event object (chứa thông tin về sự kiện)
    // - async: Vì bên trong có await (gọi API)
    const handleSubmit = async (e) => {
        // Ngăn form reload trang (hành vi mặc định của HTML form)
        e.preventDefault();

        // ===== DEBUG POINT 1: Kiểm tra form data =====
        console.log('--- Form Submitted ---');
        console.log('Username:', username);
        console.log('Password:', password);

        // Validation đơn giản
        if (!username || !password) {
            setError('Vui lòng nhập đầy đủ thông tin!');
            return; // Dừng lại, không gọi API
        }

        // Bắt đầu loading (hiển thị spinner hoặc disable button)
        setLoading(true);
        setError(''); // Xóa lỗi cũ (nếu có)

        try {
            // ===== DEBUG POINT 2: Trước khi gọi API =====
            console.log('--- Calling Login API ---');

            // Gọi hàm login từ authService
            // await: "Đợi" cho đến khi API trả về kết quả
            const response = await login(username, password);

            // ===== DEBUG POINT 3: Sau khi API thành công =====
            console.log('--- Login Success ---');
            console.log('Response:', response);
            console.log('Token:', response.token);
            console.log('User roles:', response.roles);

            // Đăng nhập thành công → chuyển trang
            // window.location.href: Chuyển đến URL mới
            alert('Đăng nhập thành công! Chào ' + response.fullname);
            window.location.href = '/dashboard';  // Tạm thời

        } catch (err) {
            // ===== DEBUG POINT 4: Khi có lỗi =====
            console.log('--- Login Failed ---');
            console.log('Error:', err);

            // Hiển thị lỗi cho user
            // err có thể là string hoặc object
            if (typeof err === 'string') {
                setError(err);
            } else {
                setError('Đăng nhập thất bại! Vui lòng thử lại.');
            }
        } finally {
            // finally: Luôn chạy dù success hay error
            setLoading(false);
        }
    };

    // ===== PHẦN 5: JSX - GIAO DIỆN =====
    // JSX là cú pháp giống HTML nhưng thực chất là JavaScript
    //
    // KHÁC BIỆT VỚI HTML:
    // - class → className (vì class là từ khóa trong JS)
    // - onclick → onClick (camelCase)
    // - style={{ color: 'red' }} (object, không phải string)
    // - {biến} để hiển thị giá trị JavaScript
    //
    return (
        // Container chính
        <div className="login-container">

            {/* Card chứa form login */}
            <div className="login-card">

                {/* Header */}
                <div className="login-header">
                    <h1>Đăng Nhập</h1>
                    <p>Hệ thống quản lý sinh viên</p>
                </div>

                {/* Hiển thị lỗi nếu có */}
                {/* {điềuKiện && <JSX>} : Chỉ render nếu điều kiện = true */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Form đăng nhập */}
                {/* onSubmit: Sự kiện khi form được submit */}
                <form onSubmit={handleSubmit}>

                    {/* Input Username */}
                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Nhập username"
                            value={username}  // Liên kết với state
                             onChange={(e)=> setUsername(e.target.value)}
                            // onChange: Sự kiện khi input thay đổi
                            // e.target.value: Giá trị mới của input (e.target phần tử gây ra sự kiện )
                            // setUsername(): Cập nhật state → UI tự động cập nhật
                            disabled={loading}  // Disable khi đang loading
                        />
                    </div>

                    {/* Input Password */}
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    {/* Button Submit */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}  // Disable khi đang loading
                    >
                        {/* Hiển thị text khác nhau dựa trên loading state */}
                        {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
                    </button>

                </form>

                {/* Debug info - XÓA KHI DEPLOY */}
                <div className="debug-info">
                    <h4>🔍 Debug Info (xóa khi deploy):</h4>
                    <p>Username state: {username}</p>
                    <p>Password state: {'*'.repeat(password.length)}</p>
                    <p>Loading: {loading.toString()}</p>
                    <p>Error: {error || 'None'}</p>
                </div>

            </div>
        </div>
    );
}

// Export component để file khác import được
// Cú pháp: export default TênComponent;
export default Login;