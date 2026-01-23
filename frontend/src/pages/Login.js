
// MỤC ĐÍCH: Component hiển thị form đăng nhập

// - Props: Dữ liệu truyền từ component cha xuống con
import React, { useState } from 'react';

// Import useNavigate từ React Router để chuyển trang
import { useNavigate } from 'react-router-dom';

// Import hàm login từ authService
import { login } from '../services/authService';

// Import CSS cho styling
import './Login.css';


function Login() {

    // Hook để chuyển trang (thay cho window.location.href)
    const navigate = useNavigate();

    // ===== PHẦN 3: KHAI BÁO STATE =====
    // useState() trả về mảng 2 phần tử: [giáTrị, hàmCậpNhật]
    // Cú pháp: const [tênBiến, setTênBiến] = useState(giáTrịBanĐầu);

    // State 1: username - lưu giá trị ô input username
    const [username, setUsername] = useState('');

    // State 2: password - lưu giá trị ô input password
    const [password, setPassword] = useState('');

    // State 3: error - lưu message lỗi (nếu có)
    const [error, setError] = useState('');

    // State 4: loading - trạng thái đang xử lý (true khi đang gọi API)
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        // Ngăn form reload trang (hành vi mặc định của HTML form)
        e.preventDefault();
        if (!username || !password) {
            setError('Vui lòng nhập đầy đủ thông tin!');
            return; // Dừng lại, không gọi API
        }
        setLoading(true);
        setError(''); // Xóa lỗi cũ (nếu có)

        try {

            // Gọi hàm login từ authService
            // await: "Đợi" cho đến khi API trả về kết quả
            const response = await login(username, password);
            // navigate: Chuyển đến URL mới (React Router)
            alert('Đăng nhập thành công! Chào ' + response.fullname);
            navigate('/dashboard');

        } catch (err) {

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
                            onChange ={(e)=>{
                            console.log('Bạn vừa gõ ',e.target.value)
                            setUsername(e.target.value)}}
                            // onChange: Sự kiện khi input thay đổi
                            // e.target.value: Giá trị mới của input
                            // setUsername(): Cập nhật state → UI tự động cập nhật
                            disabled={loading}  // Disable khi đang loading , không cho người dùng gõ khi đang xử lí
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


            </div>
        </div>
    );
}

// Export component để file khác import được
// Cú pháp: export default TênComponent;
export default Login;