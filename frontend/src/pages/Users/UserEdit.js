// ============================================
// FILE: frontend/src/pages/Users/UserEdit.js
// MỤC ĐÍCH: Chỉnh sửa thông tin user (CHỈ ADMIN)
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import './UserEdit.css';

function UserEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullname: '',
        password: '',
        roleIds: []
    });

    const [availableRoles, setAvailableRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ===== LOAD USER DATA =====
    useEffect(() => {
        const checkAuth = () => {
            const userStr = localStorage.getItem('user');
            if (!userStr) {
                navigate('/login');
                return false;
            }

            const user = JSON.parse(userStr);
            if (!user.roles || !user.roles.includes('ROLE_ADMIN')) {
                alert('⛔ Chỉ ADMIN mới có quyền!');
                navigate('/dashboard');
                return false;
            }
            return true;
        };

        const fetchData = async () => {
            if (!checkAuth()) return;

            try {
                setLoading(true);

                // Load user data
                const userRes = await api.get(`/users/${id}`);
                const userData = userRes.data;

                setFormData({
                    username: userData.username,
                    email: userData.email,
                    fullname: userData.fullname,
                    password: '',
                    roleIds: userData.roles?.map(r => r.id) || []
                });

                // Load available roles
                const rolesRes = await api.get('/roles');
                setAvailableRoles(rolesRes.data);

            } catch (err) {
                console.error('Load error:', err);
                setError(err.response?.data || 'Không thể load dữ liệu!');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    // ===== HANDLE CHANGE =====
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // ===== HANDLE ROLE CHANGE =====
    const handleRoleChange = (roleId) => {
        setFormData(prev => ({
            ...prev,
            roleIds: prev.roleIds.includes(roleId)
                ? prev.roleIds.filter(id => id !== roleId)
                : [...prev.roleIds, roleId]
        }));
    };

    // ===== SUBMIT =====
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.roleIds.length) {
            alert('⚠️ Vui lòng chọn ít nhất 1 role!');
            return;
        }

        try {
            setLoading(true);

            const updateData = {
                username: formData.username,
                email: formData.email,
                fullname: formData.fullname,
                roleIds: formData.roleIds
            };

            // Chỉ gửi password nếu user nhập
            if (formData.password.trim()) {
                updateData.password = formData.password;
            }

            await api.put(`/users/${id}`, updateData);

            alert('✅ Cập nhật user thành công!');
            navigate('/users');

        } catch (err) {
            console.error('Update error:', err);
            alert(err.response?.data || '❌ Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="user-edit-container">
            <div className="user-edit-header">
                <h1>✏️ Chỉnh sửa User</h1>
                <button onClick={() => navigate('/users')} className="btn-back">
                    ← Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit} className="user-edit-form">
                <div className="form-group">
                    <label>Username *</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Họ tên *</label>
                    <input
                        type="text"
                        name="fullname"
                        value={formData.fullname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Mật khẩu mới (để trống nếu không đổi)</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu mới..."
                    />
                </div>

                <div className="form-group">
                    <label>Roles *</label>
                    <div className="roles-checkboxes">
                        {availableRoles.map(role => (
                            <label key={role.id} className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={formData.roleIds.includes(role.id)}
                                    onChange={() => handleRoleChange(role.id)}
                                />
                                {role.name.replace('ROLE_', '')}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/users')}
                        className="btn-cancel"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UserEdit;