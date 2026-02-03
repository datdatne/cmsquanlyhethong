// frontend/src/pages/Roles/RoleList.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './RoleList.css';

function RoleList() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userStr);
        if (!user.roles || !user.roles.includes('ROLE_ADMIN')) {
            alert('⛔ Chỉ ADMIN mới có quyền!');
            navigate('/dashboard');
            return;
        }

        fetchRoles();
    }, [navigate]);

    const fetchRoles = async () => {
        try {
            setLoading(true);
            const res = await api.get('/roles');
            setRoles(res.data);
        } catch (err) {
            setError(err.response?.data || 'Không thể tải roles!');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('⚠️ Xác nhận xóa role này?')) return;

        try {
            await api.delete(`/roles/${id}`);
            alert('✅ Xóa role thành công!');
            fetchRoles();
        } catch (err) {
            alert(err.response?.data || '❌ Không thể xóa role!');
        }
    };

    if (loading) return <div className="loading-container">⏳ Đang tải...</div>;
    if (error) return <div className="error-message">❌ {error}</div>;

    return (
        <div className="role-list-container">
            <div className="role-list-header">
                <h1>🔐 Quản lý Roles</h1>
                <div className="header-actions">
                    <button onClick={() => navigate('/roles/create')} className="btn-primary">
                        ➕ Tạo Role
                    </button>
                    <button onClick={() => navigate('/dashboard')} className="btn-back">
                        ← Quay lại
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table className="role-table">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên Role</th>
                            <th>Mô tả</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="empty-state">
                                    📭 Không có role nào
                                </td>
                            </tr>
                        ) : (
                            roles.map((role, index) => (
                                <tr key={role.id}>
                                    <td>{index + 1}</td>
                                    <td><strong>{role.name}</strong></td>
                                    <td>{role.description || '-'}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => navigate(`/roles/edit/${role.id}`)}
                                                className="btn-edit"
                                                title="Chỉnh sửa"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(role.id)}
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
        </div>
    );
}

export default RoleList;