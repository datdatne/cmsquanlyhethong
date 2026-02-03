// ============================================
// FILE: frontend/src/pages/Students/StudentList.js
// MỤC ĐÍCH: Quản lý danh sách sinh viên (CRUD đầy đủ)
// ============================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getCurrentUser } from '../../services/authService';
import './StudentList.css';

function StudentList() {

    // ===== STATES =====
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // State cho modal xóa
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);

    const navigate = useNavigate();

    // ===== LẤY THÔNG TIN USER =====
    useEffect(() => {
        const user = getCurrentUser();

        if (!user) {
            navigate('/login');
            return;
        }

        setCurrentUser(user);
        console.log('Current user:', user);
    }, [navigate]);

    // ===== KIỂM TRA QUYỀN =====
    const hasRole = (roleName) => {
        if (!currentUser || !currentUser.roles) return false;
        return currentUser.roles.includes(roleName);
    };

    const isAdmin = hasRole('ROLE_ADMIN');
    const isTeacher = hasRole('ROLE_TEACHER');
    const isAdminOrTeacher = isAdmin || isTeacher;

    // ===== FETCH STUDENTS =====
    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get('/students');
            console.log('=== API Response ===', response.data);

            setStudents(response.data);

        } catch (err) {
            console.error('=== Lỗi khi tải sinh viên ===', err);
            handleApiError(err);
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

    // ===== XÓA SINH VIÊN =====
    const handleDelete = async (studentId) => {
        try {
            await api.delete(`/students/${studentId}`);
            alert('✅ Xóa sinh viên thành công!');
            fetchStudents(); // Reload danh sách
            setShowDeleteModal(false);
        } catch (err) {
            console.error('=== Lỗi khi xóa sinh viên ===', err);

            if (err.response && err.response.data) {
                alert(`❌ ${err.response.data}`);
            } else {
                alert('❌ Không thể xóa sinh viên!');
            }
        }
    };

    // ===== OPEN DELETE MODAL =====
    const openDeleteModal = (student) => {
        setStudentToDelete(student);
        setShowDeleteModal(true);
    };

    // ===== CLOSE DELETE MODAL =====
    const closeDeleteModal = () => {
        setStudentToDelete(null);
        setShowDeleteModal(false);
    };

    // ===== LOAD STUDENTS KHI MOUNT =====
    useEffect(() => {
        if (currentUser) {
            fetchStudents();
        }
    }, [currentUser]);

    // ===== FORMAT DATE =====
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // ===== RENDER =====
    return (
        <div className="student-list-container">
            {/* Header */}
            <div className="student-list-header">
                <h1>👨‍🎓 Danh sách sinh viên</h1>

                <div className="header-actions">
                    {/* Chỉ ADMIN mới có button tạo mới */}
                    {isAdmin && (
                        <button
                            onClick={() => navigate('/students/create')}
                            className="btn-primary"
                        >
                            ➕ Thêm sinh viên
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="btn-back"
                    >
                        ← Quay lại
                    </button>
                </div>
            </div>

            {/* Debug Info */}
            <div className="debug-box">
                <h4>🔍 Debug Info:</h4>
                <p>Username: {currentUser?.username || 'N/A'}</p>
                <p>Roles: {currentUser?.roles?.join(', ') || 'N/A'}</p>
                <p>Is Admin: {isAdmin.toString()}</p>
                <p>Is Teacher: {isTeacher.toString()}</p>
                <p>Loading: {loading.toString()}</p>
                <p>Error: {error || 'None'}</p>
                <p>Số sinh viên: {students.length}</p>
            </div>

            {/* LOADING */}
            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
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
                                    <th>Ngày sinh</th>
                                    <th>Email</th>
                                    <th>Điện thoại</th>
                                    <th>Lớp</th>
                                    <th>Ngành</th>
                                    {isAdmin && <th>Thao tác</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan={isAdmin ? "9" : "8"} className="empty-state">
                                            📭 Không có sinh viên nào trong hệ thống
                                        </td>
                                    </tr>
                                ) : (
                                    students.map((student, index) => (
                                        <tr key={student.id}>
                                            <td>{index + 1}</td>
                                            <td><strong>{student.studentcode}</strong></td>
                                            <td>{student.fullname}</td>
                                            <td>{formatDate(student.dateofbirth)}</td>
                                            <td>{student.email}</td>
                                            <td>{student.phone || '-'}</td>
                                            <td>{student.classname || '-'}</td>
                                            <td>{student.major || '-'}</td>
                                            {isAdmin && (
                                                <td>
                                                    <div className="action-buttons">
                                                        <button onClick={() => navigate(`/students/edit/${student.id}`)} className="btn-edit" title="Chỉnh sửa">
                                                            ✏️
                                                        </button>
                                                        <button onClick={() => openDeleteModal(student)} className="btn-delete" title="Xóa">
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            )}
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
                        <h3>⚠️ Xác nhận xóa sinh viên</h3>
                        <p>
                            Bạn có chắc muốn xóa sinh viên{' '}
                            <strong>{studentToDelete?.fullname}</strong> ({studentToDelete?.studentcode})?
                        </p>
                        <p style={{ color: '#dc2626', fontSize: '14px' }}>
                            ⚠️ Hành động này không thể hoàn tác!
                        </p>
                        <div className="modal-actions">
                            <button
                                onClick={() => handleDelete(studentToDelete.id)}
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

export default StudentList;