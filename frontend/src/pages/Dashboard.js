// ============================================
// FILE: Dashboard.js
// MỤC ĐÍCH: Trang chính sau khi đăng nhập thành công
// ============================================

import React, { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../services/authService';
import './Dashboard.css';

function Dashboard() {
    // ===== STATE =====
    // Lưu thông tin user đang đăng nhập
    const [user, setUser] = useState(null);

    // ===== useEffect =====
    // Chạy 1 lần khi component được mount (hiển thị)
    // Giống @PostConstruct trong Spring
    useEffect(() => {

        // Lấy thông tin user từ localStorage
        const currentUser = getCurrentUser();

        console.log('Dashboard loaded, user:', currentUser);

        // Nếu không có user (chưa đăng nhập) → chuyển về login
        if (!currentUser) {
            window.location.href = '/login';
            return;
        }

        // Lưu user vào state để hiển thị
        setUser(currentUser);
    }, []); // [] = chỉ chạy 1 lần khi mount

    // ===== HANDLER: Đăng xuất =====
    const handleLogout = () => {
        // Gọi hàm logout từ authService (xóa token)
        logout();

        // Chuyển về trang login
        window.location.href = '/login';
    };

    // ===== RENDER =====
    // Nếu chưa có user → hiển thị loading
    if (!user) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải...</p>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            {/* ===== SIDEBAR ===== */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>📚 CMS</h2>
                    <p>Quản lý sinh viên</p>
                </div>

                <nav className="sidebar-nav">
                    <a href="/dashboard" className="nav-item active">
                        <span className="nav-icon">🏠</span>
                        <span>Dashboard</span>
                    </a>

                    {/* Chỉ hiện nếu là ADMIN hoặc TEACHER */}
                    {(user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_TEACHER')) && (
                        <a href="/students" className="nav-item">
                            <span className="nav-icon">👨‍🎓</span>
                            <span>Quản lý sinh viên</span>
                        </a>
                    )}

                    {/* Chỉ hiện nếu là ADMIN */}
                    {user.roles?.includes('ROLE_ADMIN') && (
                        <>
                            <a href="/users" className="nav-item">
                                <span className="nav-icon">👥</span>
                                <span>Quản lý người dùng</span>
                            </a>
                            <a href="/roles" className="nav-item">
                                <span className="nav-icon">🔐</span>
                                <span>Phân quyền</span>
                            </a>
                        </>
                    )}

                    <a href="/profile" className="nav-item">
                        <span className="nav-icon">👤</span>
                        <span>Thông tin cá nhân</span>
                    </a>
                </nav>

                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        <span>🚪</span>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </aside>

            {/* ===== MAIN CONTENT ===== */}
            <main className="main-content">
                {/* Header */}
                <header className="main-header">
                    <h1>{user.username}</h1>
                    <div className="user-info">
                        <span className="user-name">Xin chào, {user.fullname || user.username}!</span>
                        <span className="user-role">
                            {user.roles?.map(role => role.replace('ROLE_', '')).join(', ')}
                        </span>
                    </div>
                </header>

                {/* Stats Cards */}
                <section className="stats-grid">
                {(user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_TEACHER')) && (
                    <div className="stat-card">
                        <div className="stat-icon blue">👨‍🎓</div>
                        <div className="stat-info">
                            <h3>Sinh viên</h3>
                            <p className="stat-number">150</p>
                        </div>
                    </div>)}

                    <div className="stat-card">
                        <div className="stat-icon green">👨‍🏫</div>
                        <div className="stat-info">
                            <h3>Giáo viên</h3>
                            <p className="stat-number">12</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon orange">📚</div>
                        <div className="stat-info">
                            <h3>Lớp học</h3>
                            <p className="stat-number">8</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">📊</div>
                        <div className="stat-info">
                            <h3>Môn học</h3>
                            <p className="stat-number">24</p>
                        </div>
                    </div>
                </section>

                {/* Welcome Section */}
                <section className="welcome-section">
                    <h2>👋 Chào mừng đến với hệ thống!</h2>
                    <p>Đây là trang quản lý sinh viên theo CMS. Bạn có thể:</p>
                    <ul>
                        <li>Xem và quản lý danh sách sinh viên</li>
                        <li>Quản lý người dùng và phân quyền</li>
                        <li>Xem thông tin cá nhân</li>
                    </ul>
                </section>

                {/* Debug Info - XÓA KHI DEPLOY */}
                <section className="debug-section">
                    <h3>🔍 Debug Info (xóa khi deploy):</h3>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;