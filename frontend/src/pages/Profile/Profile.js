// ============================================
// FILE: frontend/src/pages/Profile/Profile.js (TEST VERSION)
// MỤC ĐÍCH: Test xem getCurrentUser() trả về gì
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getCurrentUser } from '../../services/authService';
import './Profile.css';

function Profile() {
    const navigate = useNavigate();

    // States
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [debugInfo, setDebugInfo] = useState(null);

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            const currentUser = getCurrentUser();

            // DEBUG: Xem currentUser có gì
            console.log('=== DEBUG: Current User ===', currentUser);
            setDebugInfo(currentUser);

            if (!currentUser || !currentUser.username) {
                setError('Không tìm thấy thông tin đăng nhập!');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                console.log('=== Calling API: /users/username/' + currentUser.username);

                // Lấy thông tin user CỦA CHÍNH MÌNH
                const userResponse = await api.get(`/users/username/${currentUser.username}`);
                console.log('=== User Response ===', userResponse.data);

                // Nếu user có role STUDENT, lấy thêm thông tin student
                const hasStudentRole = userResponse.data.roles?.some(
                    role => role.name === 'ROLE_STUDENT'
                );

                if (hasStudentRole) {
                    try {
                        const studentsResponse = await api.get('/students');
                        const studentData = studentsResponse.data.find(
                            s => s.email === userResponse.data.email
                        );

                        if (studentData) {
                            userResponse.data.student = studentData;
                        }
                    } catch (err) {
                        console.log('Student data not found');
                    }
                }

                setProfileData(userResponse.data);

            } catch (err) {
                console.error('=== ERROR ===', err);
                console.error('Response:', err.response?.data);

                if (err.response?.status === 401) {
                    setError('Phiên đăng nhập hết hạn!');
                } else if (err.response?.status === 404) {
                    setError('Không tìm thấy user với username: ' + currentUser.username);
                } else {
                    setError('Lỗi: ' + (err.response?.data || err.message));
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Format role name
    const formatRoleName = (role) => {
        const roleMap = {
            'ROLE_ADMIN': 'Quản trị viên',
            'ROLE_TEACHER': 'Giảng viên',
            'ROLE_STUDENT': 'Sinh viên'
        };
        return roleMap[role] || role;
    };

    return (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <h1>👤 Thông tin cá nhân</h1>
                <button onClick={() => navigate('/dashboard')} className="btn-back">
                    ← Quay lại
                </button>
            </div>

            {/* DEBUG BOX */}
            <div className="debug-box">
                <h4>🔍 Debug Info:</h4>
                <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>

            {/* Loading */}
            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>⏳ Đang tải thông tin...</p>
                </div>
            )}

            {/* Error */}
            {error && !loading && (
                <div className="error-message">
                    <strong>❌ Lỗi:</strong> {error}
                </div>
            )}

            {/* Profile Data */}
            {!loading && !error && profileData && (
                <div className="profile-card">
                    {/* Avatar Section */}
                    <div className="profile-avatar-section">
                        <div className="avatar-circle">
                            {profileData.fullname?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <h2>{profileData.fullname || 'N/A'}</h2>
                        <div className="role-badges">
                            {profileData.roles?.map((role, index) => (
                                <span key={index} className={`role-badge role-${role.name.toLowerCase()}`}>
                                    {formatRoleName(role.name)}
                                </span>
                            ))}
                        </div>
                        <div className="status-badge">
                            {profileData.isActive ? (
                                <span className="status-active">✓ Đang hoạt động</span>
                            ) : (
                                <span className="status-inactive">✗ Đã khóa</span>
                            )}
                        </div>
                    </div>

                    {/* User Info Section */}
                    <div className="profile-info-section">
                        <h3>📋 Thông tin tài khoản</h3>

                        <div className="info-grid">
                            <div className="info-item">
                                <label>Tên đăng nhập:</label>
                                <span>{profileData.username}</span>
                            </div>

                            <div className="info-item">
                                <label>Email:</label>
                                <span>{profileData.email}</span>
                            </div>

                            <div className="info-item">
                                <label>Họ và tên:</label>
                                <span>{profileData.fullname || '-'}</span>
                            </div>

                            <div className="info-item">
                                <label>Ngày tạo:</label>
                                <span>{formatDate(profileData.createdAt)}</span>
                            </div>

                            <div className="info-item">
                                <label>Cập nhật lần cuối:</label>
                                <span>{formatDate(profileData.updatedAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Student Info Section */}
                    {profileData.student && (
                        <div className="profile-info-section">
                            <h3>🎓 Thông tin sinh viên</h3>

                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Mã sinh viên:</label>
                                    <span><strong>{profileData.student.studentcode || profileData.student.studentCode}</strong></span>
                                </div>

                                <div className="info-item">
                                    <label>Ngày sinh:</label>
                                    <span>{formatDate(profileData.student.dateofbirth || profileData.student.dateOfBirth)}</span>
                                </div>

                                <div className="info-item">
                                    <label>Điện thoại:</label>
                                    <span>{profileData.student.phone || '-'}</span>
                                </div>

                                <div className="info-item">
                                    <label>Lớp:</label>
                                    <span>{profileData.student.classname || profileData.student.className || '-'}</span>
                                </div>

                                <div className="info-item">
                                    <label>Ngành:</label>
                                    <span>{profileData.student.major || '-'}</span>
                                </div>

                                <div className="info-item full-width">
                                    <label>Địa chỉ:</label>
                                    <span>{profileData.student.address || '-'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="profile-actions">
                        <button
                            onClick={() => alert('Chức năng đang phát triển!')}
                            className="btn-edit-profile"
                        >
                            ✏️ Chỉnh sửa thông tin
                        </button>
                        <button
                            onClick={() => alert('Chức năng đang phát triển!')}
                            className="btn-change-password"
                        >
                            🔒 Đổi mật khẩu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;