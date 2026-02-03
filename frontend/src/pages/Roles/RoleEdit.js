// frontend/src/pages/Roles/RoleEdit.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import './RoleForm.css';

function RoleEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);

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

        fetchRole();
    }, [id, navigate]);

    const fetchRole = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/roles/${id}`);
            setFormData({
                name: res.data.name,
                description: res.data.description || ''
            });
        } catch (err) {
            alert('❌ Không thể tải role!');
            navigate('/roles');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('⚠️ Vui lòng nhập tên role!');
            return;
        }

        try {
            setLoading(true);
            await api.put(`/roles/${id}`, formData);
            alert('✅ Cập nhật role thành công!');
            navigate('/roles');
        } catch (err) {
            const errorMsg = err.response?.data?.message
                || err.response?.data
                || 'Cập nhật thất bại!';
            alert(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container">⏳ Đang tải...</div>;
    }

    return (
        <div className="role-form-container">
            <div className="role-form-header">
                <h1>✏️ Chỉnh sửa Role</h1>
                <button onClick={() => navigate('/roles')} className="btn-back">
                    ← Quay lại
                </button>
            </div>

            <form onSubmit={handleSubmit} className="role-form">
                <div className="form-group">
                    <label>Tên Role *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Mô tả</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Mô tả vai trò..."
                        rows="4"
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/roles')}
                        className="btn-cancel"
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
}

export default RoleEdit;