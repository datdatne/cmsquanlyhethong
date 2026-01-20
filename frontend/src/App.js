// ============================================
// FILE: App.js
// MỤC ĐÍCH: Component gốc của ứng dụng
// ============================================
//
// App.js là "entry point" của React app
// Tất cả các component khác sẽ được render bên trong App
//
// SO SÁNH VỚI SPRING BOOT:
// - App.js ≈ Main Application class
// - Các component con ≈ Các Controller
//

import React from 'react';

// Import component Login
import Login from './pages/Login';

// Import CSS (nếu cần)
import './App.css';

function App() {
    // ===== TẠM THỜI: Chỉ hiển thị trang Login =====
    // Sau này sẽ thêm Router để điều hướng giữa các trang

    return (
        <div className="App">
            {/* Render component Login */}
            <Login />
        </div>
    );
}

export default App;