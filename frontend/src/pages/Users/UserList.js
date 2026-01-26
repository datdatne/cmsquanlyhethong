// ============================================
// FILE: frontend/src/pages/Users/UserList.js
// MỤC ĐÍCH: Quản lý danh sách người dùng (CHỈ ADMIN)
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './UserList.css';

function UserList() {

    // ===== STATES =====
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');

    // State cho modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const navigate = useNavigate();

    // ===== KIỂM TRA QUYỀN ADMIN =====
    useEffect(() => {
        const userStr = localStorage.getItem('user');

        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user);

            // CHỈ cho ADMIN vào trang này
            if (!user.roles || !user.roles.includes('ROLE_ADMIN')) {
                alert('⛔ Chỉ ADMIN mới có quyền truy cập trang này!');
                navigate('/dashboard');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // ===== FETCH USERS =====
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/users');
            console.log('=== Dữ liệu users ===', response.data);
            setUsers(response.data);

        } catch (err) {
            console.error('=== Lỗi khi tải users ===', err);
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    // ===== TÌM KIẾM USERS =====
    const handleSearch = async (e) => {
        e.preventDefault();

        if (!searchKeyword.trim()) {
            fetchUsers(); // Nếu rỗng → load all
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await api.get(`/users/search?keyword=${searchKeyword}`);
            setUsers(response.data);

        } catch (err) {
            console.error('=== Lỗi khi tìm kiếm ===', err);
            handleApiError(err);
        } finally {
            setLoading(false);
        }
    };

    // ===== XÓA USER =====
    const handleDelete = async (userId) => {
        try {
            await api.delete(`/users/${userId}`);
            alert('✅ Xóa user thành công!');
            fetchUsers(); // Reload danh sách
            setShowDeleteModal(false);
        } catch (err) {
            console.error('=== Lỗi khi xóa user ===', err);
            handleApiError(err);
        }
    };

    // ===== KÍCH HOẠT/KHÓA USER =====
    const handleToggleStatus = async (userId) => {
        try {
            await api.patch(`/users/${userId}/toggle-status`);
            alert('✅ Cập nhật trạng thái thành công!');
            fetchUsers(); // Reload danh sách
        } catch (err) {
            console.error('=== Lỗi khi toggle status ===', err);
            handleApiError(err);
        }
    };

    // ===== XỬ LÝ LỖI API =====
    const handleApiError = (err) => {
        if (err.response) {
            if (err.response.status === 401) {
                setError('Token hết hạn! Vui lòng đăng nhập lại.');
                setTimeout(() => navigate('/login'), 2000);
            } else if (err.response.status === 403) {
                setError('Bạn không có quyền thực hiện thao tác này!');
            } else {
                setError(err.response.data || 'Có lỗi xảy ra!');
            }
        } else if (err.request) {
            setError('Không thể kết nối đến server!');
        } else {
            setError(err.message);
        }
    };

    // ===== OPEN DELETE MODAL =====
    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    // ===== CLOSE DELETE MODAL =====
    const closeDeleteModal = () => {
        setUserToDelete(null);
        setShowDeleteModal(false);
    };

    // ===== useEffect - LOAD USERS =====
    useEffect(() => {
        if (currentUser) {
            fetchUsers();
        }
    }, [currentUser]);

    // ===== RENDER =====
    return (
        <div className="user-list-container">
            {/* Header */}
            <div className="user-list-header">
                <h1>👥 Quản lý người dùng</h1>
                <div className="header-actions">
                    <button
                        onClick={() => navigate('/users/create')}
                        className="btn-primary"
                    >
                        ➕ Tạo user mới
                    </button>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn-back"
                    >
                        ← Quay lại
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="🔍 Tìm kiếm theo username, email, fullname..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="btn-search">
                    Tìm kiếm
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setSearchKeyword('');
                        fetchUsers();
                    }}
                    className="btn-reset"
                >
                    Reset
                </button>
            </form>

            {/* Debug Info */}
            <div className="debug-box">
                <h4>🔍 Debug Info:</h4>
                <p>Current User: {currentUser?.username}</p>
                <p>Roles: {currentUser?.roles?.join(', ')}</p>
                <p>Loading: {loading.toString()}</p>
                <p>Error: {error || 'None'}</p>
                <p>Số lượng users: {users.length}</p>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="loading-container">
                    <p>⏳ Đang tải dữ liệu...</p>
                </div>
            )}

            {/* ERROR */}
            {error && !loading && (
                <div className="error-message">
                    <strong>❌ Lỗi:</strong> {error}
                </div>
            )}

            {/* DATA */}
            {!loading && !error && (
                <>
                    {/* Summary */}
                    <div className="user-summary">
                        <p>Tổng số: <strong>{users.length}</strong> users</p>
                    </div>

                    {/* Table */}
                    <div className="table-container">
                        <table className="user-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Họ tên</th>
                                    <th>Roles</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="empty-state">
                                            📭 Không tìm thấy user nào
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <tr key={user.id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <strong>{user.username}</strong>
                                            </td>
                                            <td>{user.email}</td>
                                            <td>{user.fullname}</td>
                                            <td>
                                                <div className="roles-badges">
                                                    {user.roles && user.roles.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className={`badge badge-${role.name.toLowerCase()}`}
                                                        >
                                                            {role.name.replace('ROLE_', '')}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                                                    {user.isActive ? '✅ Active' : '🔒 Locked'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => navigate(`/users/edit/${user.id}`)}
                                                        className="btn-edit"
                                                        title="Chỉnh sửa"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id)}
                                                        className="btn-toggle"
                                                        title={user.isActive ? 'Khóa tài khoản' : 'Kích hoạt'}
                                                    >
                                                        {user.isActive ? '🔒' : '🔓'}
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(user)}
                                                        className="btn-delete"
                                                        title="Xóa"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={closeDeleteModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>⚠️ Xác nhận xóa user</h3>
                        <p>
                            Bạn có chắc chắn muốn xóa user <strong>{userToDelete?.username}</strong>?
                        </p>
                        <p style={{ color: '#dc2626', fontSize: '14px' }}>
                            ⚠️ Hành động này không thể hoàn tác!
                        </p>
                        <div className="modal-actions">
                            <button
                                onClick={() => handleDelete(userToDelete.id)}
                                className="btn-confirm-delete"
                            >
                                Xóa
                            </button>
                            <button
                                onClick={closeDeleteModal}
                                className="btn-cancel"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserList;