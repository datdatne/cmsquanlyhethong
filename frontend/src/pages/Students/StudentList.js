// ============================================
// FILE: frontend/src/pages/Students/StudentList.js
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; //
import api from '../../services/api';
import './StudentList.css';

function StudentList() {

    // ===== STATES =====
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null); // ← State lưu user info

    // Hook để điều hướng
    const navigate = useNavigate();

    // ===== LẤY THÔNG TIN USER TỪ LOCALSTORAGE =====
    useEffect(() => {
        // Đọc user từ localStorage
        const userStr = localStorage.getItem('user');

        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                setCurrentUser(user);
                console.log('=== Current User ===', user);
            } catch (err) {
                console.error('Lỗi parse user:', err);
            }
        } else {
            // Không có user → chuyển về login
            navigate('/login');
        }
    }, []); // Chỉ chạy 1 lần khi mount

    // ===== KIỂM TRA QUYỀN =====
    // Hàm kiểm tra user có role cụ thể không
    const hasRole = (roleName) => {
        if (!currentUser || !currentUser.roles) return false;
        return currentUser.roles.includes(roleName);
    };

    // Kiểm tra có phải ADMIN hoặc TEACHER không
    const isAdminOrTeacher = hasRole('ROLE_ADMIN') || hasRole('ROLE_TEACHER');

    // ===== FETCH STUDENTS =====
    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/students');
            console.log('=== Dữ liệu sinh viên ===', response.data);
            setStudents(response.data);

        } catch (err) {
            console.error('=== Lỗi khi tải sinh viên ===', err);

            if (err.response) {
                if (err.response.status === 401) {
                    setError('Token hết hạn! Vui lòng đăng nhập lại.');
                    // Tự động chuyển về login sau 2 giây
                    setTimeout(() => navigate('/login'), 2000);
                } else if (err.response.status === 403) {
                    setError('Bạn không có quyền xem danh sách sinh viên!');
                } else {
                    setError(err.response.data || 'Lỗi khi tải danh sách!');
                }
            } else if (err.request) {
                setError('Không thể kết nối đến server! Vui lòng kiểm tra backend.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    // ===== useEffect - GỌI API =====
    useEffect(() => {
        // Chỉ gọi API khi đã có currentUser
        if (currentUser) {
            fetchStudents();
        }
    }, [currentUser]); // ← Dependency: chạy lại khi currentUser thay đổi

    // ===== HANDLER: QUAY LẠI DASHBOARD =====
    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    // ===== RENDER =====
    return (
        <div className="student-list-container">
            {/* Header */}
            <div className="student-list-header">
                <h1>📚 Danh sách sinh viên</h1>

                {/* Button quay lại - CHỈ HIỂN THỊ cho ADMIN/TEACHER */}
                {isAdminOrTeacher && (
                    <button
                        onClick={handleBackToDashboard}
                        className="btn-back"
                    >
                        ← Quay lại Dashboard
                    </button>
                )}
            </div>

            {/* Debug Info */}
            <div className="debug-box">
                <h4>🔍 Debug Info (xóa khi deploy):</h4>
                <p>Username: {currentUser?.username || 'N/A'}</p>
                <p>Roles: {currentUser?.roles?.join(', ') || 'N/A'}</p>
                <p>Is Admin/Teacher: {isAdminOrTeacher.toString()}</p>
                <p>Loading: {loading.toString()}</p>
                <p>Error: {error || 'None'}</p>
                <p>Số lượng sinh viên: {students.length}</p>
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
                    <div className="student-summary">
                        <p>
                            Tổng số: <strong>{students.length}</strong> sinh viên
                        </p>
                    </div>

                    {/* Table */}
                    <div className="table-container">
                        <table className="student-table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Mã SV</th>
                                    <th>Họ tên</th>
                                    <th>Email</th>
                                    <th>Lớp</th>
                                    <th>Ngành</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="empty-state">
                                            📭 Không có sinh viên nào trong hệ thống
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student, index) => (
                                        <tr key={student.id}>
                                            <td>{index + 1}</td>
                                            <td>{student.studentcode}</td>
                                            <td>{student.fullname}</td>
                                            <td>{student.email}</td>
                                            <td>{student.classname || '-'}</td>
                                            <td>{student.major || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}

export default StudentList;