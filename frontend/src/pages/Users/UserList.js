// ============================================
// FILE: frontend/src/pages/Users/UserList.js
// MỤC ĐÍCH: Quản lý danh sách người dùng (CHỈ ADMIN)
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import {getCurrentUser}from '../../services/authService';
import './UserList.css';

function UserList() {

    // ===== STATES =====
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(''); // dùng để lấy giá trị trong ô input

    // State cho modal
    const [showDeleteModal, setShowDeleteModal] = useState(false); // điều khiển ui (Hiển thị ra màn hình bạn có muốn xóa ... ko)
    const [userToDelete, setUserToDelete] = useState(null); // dùng để xóa user

    const navigate = useNavigate();

    // ===== KIỂM TRA QUYỀN ADMIN =====
    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user); // set để component rende lại để nhận user
            // CHỈ cho ADMIN vào trang này
            if (!user.roles || !user.roles.includes('ROLE_ADMIN')) {
                alert('⛔ Chỉ ADMIN mới có quyền truy cập trang này!');
                navigate('/dashboard');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // ===== Lấy danh sách users từ DB =====
    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/users'); // if api thành công
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
        e.preventDefault(); // không cho mặc định mà phải làm theo SPA

        if (!searchKeyword.trim()) { // nếu rỗng thì load lại hàm fetchUsers
            fetchUsers(); // Nếu rỗng → load all
            return;
        }

        try {
            setLoading(true); // bật spinner
            setError(null); // xóa lỗi
            const response = await api.get(`/users/search?keyword=${searchKeyword}`); // chờ api của backend
            setUsers(response.data); // rende để thay đổi lại danh sách user

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
            setShowDeleteModal(false); // nó set nó về false nếu để true người dùng ấn xóa thêm lần nữa
            // thì nó sẽ gọi lại request mà request không tìm thấy id đâu nên sẽ gây ra lỗi
        } catch (err) {
            console.error('=== Lỗi khi xóa user ===', err);
            handleApiError(err);
        }
    };

    // ===== KÍCH HOẠT/KHÓA USER =====
    const handleToggleStatus = async (userId, currentStatus) => {

        const currentUser = getCurrentUser();

        if (userId === currentUser.id) {
            alert('⚠️ Bạn không thể thay đổi trạng thái tài khoản của chính mình!');
            return;
            // giải thích là nếu đăng nhập với id=5 thì không thể tự xóa mình
        }

        // ====== BƯỚC 2: Xác nhận hành động ======
         console.log("currentStatus",currentStatus);
        const action = currentStatus ? 'KHÓA' : 'MỞ KHÓA';
        console.log("currentStatus",currentStatus);
        console.log("action",action);
        const confirmMessage = `Bạn có chắc muốn ${action} tài khoản này?`;

        if (!window.confirm(confirmMessage)) {
            return; // người dùng ấn cancle thì dừng ngay
        }


        try {
          // ====== BƯỚC 3: Gọi API ======
                setLoading(true);
         // GỌI API PATCH để toggle status
                await api.patch(`/users/${userId}/toggle-status`);

            // ====== BƯỚC 4: Cập nhật UI ======
            setUsers(users.map(user =>
                user.id === userId // userId là tham số truyền vào nhờ button , user.id là id thật được map tạo thành mảng
                    ? { ...user, active: !currentStatus }
                    : user
            ));

            // ====== BƯỚC 5: Thông báo thành công ======
            alert(`✅ ${action} tài khoản thành công!`);

        } catch (error) {
            console.error('Toggle status error:', error);
            alert(`❌ Không thể ${action} tài khoản. Vui lòng thử lại!`);
        } finally {
            setLoading(false);
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
                                                <span className={`status-badge ${user.active ? 'active' :'inactive' }`}>
                                                    {user.active ? '✅ Active' : '🔒 Locked' }
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
                                                    {/* Button Khóa/Mở khóa */}
                                                    <button
                                                        onClick={() => handleToggleStatus(
                                                            user.id,
                                                            user.active
                                                        )}
                                                        className={user.active ? 'btn-danger' : 'btn-success'}
                                                        disabled={loading || user.id === getCurrentUser().id}
                                                        title={
                                                            user.id === getCurrentUser().id
                                                                ? 'Không thể tự thay đổi trạng thái'
                                                                : (user.active ? 'Khóa  tài khoản' :'Mở tài khoản' )
                                                        }
                                                    >
                                                        {user.active ? '🔓 Khóa' : '🔒 Mở'}
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