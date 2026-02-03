// ============================================
// FILE: frontend/src/pages/Users/UserCreate.js
// MỤC ĐÍCH: Tạo user mới (CHỈ ADMIN)
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './UserEdit.css'; // Dùng chung CSS

function UserCreate() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        fullname: '',
        password: '',
        roleIds: [],
        isActive: true
    });

    const [availableRoles, setAvailableRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    // ===== KIỂM TRA QUYỀN & LOAD ROLES =====
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

        // Load roles
        const fetchRoles = async () => {
            try {
                const res = await api.get('/roles');
                setAvailableRoles(res.data);
            } catch (err) {
                console.error('Load roles error:', err);
            }
        };
        fetchRoles();
    }, [navigate]);

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

        if (!formData.password.trim()) {
            alert('⚠️ Vui lòng nhập mật khẩu!');
            return;
        }

        try {
            setLoading(true);



            await api.post('/users', formData);

            alert('✅ Tạo user thành công!');
            navigate('/users');

       } catch (err) {
           console.error('Create error:', err);

           let errorMsg = '❌ Tạo user thất bại!';

           if (err.response) {
               // Backend trả về lỗi
               if (typeof err.response.data === 'string') {
                   errorMsg = err.response.data;
               } else if (err.response.data?.message) {
                   errorMsg = err.response.data.message;
               } else if (err.response.status === 409) {
                   errorMsg = 'Username hoặc email đã tồn tại!';
               }
           }

           alert(errorMsg);
       } finally {
           setLoading(false);
       }
    };

    return (
        <div className="user-edit-container">
            <div className="user-edit-header">
                <h1>➕ Tạo User Mới</h1>
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
                    <label>Mật khẩu *</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Nhập mật khẩu..."
                        required
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
                        {loading ? '⏳ Đang tạo...' : '➕ Tạo User'}
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

export default UserCreate;