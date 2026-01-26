// ============================================
// FILE: App.js
// MỤC ĐÍCH: Component gốc với Routing
// ============================================
//
// React Router: Thư viện điều hướng giữa các trang
// - BrowserRouter: Bọc toàn bộ app để enable routing
// - Routes: Chứa các Route
// - Route: Định nghĩa đường dẫn → Component
// - Navigate: Chuyển hướng tự động
//

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import các pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

import StudentList from './pages/Students/StudentList';
import UserList from './pages/Users/UserList';
// Import service để check auth
import { isAuthenticated } from './services/authService';

import './App.css';

// ============================================
// PROTECTED ROUTE COMPONENT
// ============================================
// Mục đích: Bảo vệ các trang cần đăng nhập
// Nếu chưa đăng nhập → chuyển về /login
//
function ProtectedRoute({ children }) {
    // Kiểm tra đã đăng nhập chưa
    if (!isAuthenticated()) {
        // Chưa đăng nhập → redirect về login
        return <Navigate to="/login" replace />;
    }

    // Đã đăng nhập → hiển thị trang con
    return children;
}

// ============================================
// PUBLIC ROUTE COMPONENT
// ============================================
// Mục đích: Trang công khai (login, register)
// Nếu đã đăng nhập → chuyển về /dashboard
//
function PublicRoute({ children }) {
    // Kiểm tra đã đăng nhập chưa
    if (isAuthenticated()) {
        // Đã đăng nhập → redirect về dashboard
        return <Navigate to="/dashboard" replace />;
    }

    // Chưa đăng nhập → hiển thị trang login
    return children;
}

// ============================================
// MAIN APP COMPONENT
// ============================================
function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />

                    {/* Trang Login - Public */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    {/* Trang Dashboard - Protected */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Các trang khác - sẽ thêm sau */}
                    <Route
                        path="/students"
                        element={
                            <ProtectedRoute>
                                <StudentList /> {/* Tạm thời dùng Dashboard */}
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute>
                                <UserList />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 - Không tìm thấy trang */}
                    <Route
                        path="*"
                        element={
                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100vh',
                                flexDirection: 'column'
                            }}>
                                <h1>404</h1>
                                <p>Không tìm thấy trang</p>
                                <a href="/dashboard">Về trang chủ</a>
                            </div>
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;