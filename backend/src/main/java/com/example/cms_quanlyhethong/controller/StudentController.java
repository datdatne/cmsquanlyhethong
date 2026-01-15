package com.example.cms_quanlyhethong.controller;

import com.example.cms_quanlyhethong.dto.request.student.StudentCreateRequest;
import com.example.cms_quanlyhethong.dto.request.student.StudentUpdateRequest;
import com.example.cms_quanlyhethong.dto.response.student.StudentResponse;
import com.example.cms_quanlyhethong.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * ==========================================
 * STUDENT CONTROLLER - QUẢN LÝ SINH VIÊN
 * ===============================v===========
 * Base URL: /api/students
 *
 * Chức năng:
 * - Xem danh sách sinh viên
 * - Xem chi tiết sinh viên
 * - Tạo sinh viên mới
 * - Cập nhật thông tin sinh viên
 * - Xóa sinh viên
 */
@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    /**
     * ==========================================
     * API 1: LẤY DANH SÁCH TẤT CẢ SINH VIÊN
     * ==========================================
     * Request:
     *   GET http://localhost:8080/api/students
     *
     * Response (200 OK):
     * [
     *   {
     *     "id": 1,
     *     "studentcode": "SV001",
     *     "fullname": "Nguyen Van A",
     *     "email": "a@gmail.com",
     *     ...
     *   }
     * ]
     */
    @PreAuthorize("hasAnyRole('TEACHER','ADMIN')")
    @GetMapping
    public ResponseEntity<List<StudentResponse>> getAllStudents() {
        List<StudentResponse> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }

    /**
     * ==========================================
     * API 2: LẤY THÔNG TIN 1 SINH VIÊN THEO ID
     * ==========================================
     * Request:
     *   GET http://localhost:8080/api/students/1
     *
     * Response (200 OK):
     * {
     *   "id": 1,
     *   "studentcode": "SV001",
     *   "fullname": "Nguyen Van A",
     *   ...
     * }
     *
     * Response (400 Bad Request):
     * "Không tìm thấy sinh viên với ID: 1"
     */
    @PreAuthorize("hasAnyRole('STUDENT','TEACHER','ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String currentUsername = auth.getName(); // Tên đăng nhập trong Token
            // Check role xem có phải Admin hay Teacher không
            boolean isAdminOrTeacher = auth.getAuthorities().stream()
                    .anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN") || r.getAuthority().equals("ROLE_TEACHER"));
            StudentResponse student = studentService.getStudentById(id);
            if (!isAdminOrTeacher && !student.getEmail().equals(currentUsername)) {
                // (Giả sử email là username, hoặc bạn so sánh field username tương ứng)
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xem thông tin sinh viên khác!");
            }
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * ==========================================
     * API 3: TẠO SINH VIÊN MỚI
     * ==========================================
     * Request:
     *   POST http://localhost:8080/api/students
     *   Content-Type: application/json
     *
     * Body:
     * {
     *   "studentcode": "SV001",
     *   "fullname": "Nguyen Van A",
     *   "email": "a@gmail.com",
     *   "phone": "0123456789",
     *   "address": "Ha Noi",
     *   "major": "Cong nghe thong tin",
     *   "classname": "IT01"
     * }
     *
     * Response (200 OK):
     * {
     *   "id": 1,
     *   "studentcode": "SV001",
     *   ...
     * }
     *
     * Response (400 Bad Request):
     * "Mã sinh viên đã tồn tại: SV001"
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody StudentCreateRequest request) {
        try {
            StudentResponse student = studentService.createStudent(request);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * ==========================================
     * API 4: CẬP NHẬT SINH VIÊN
     * ==========================================
     * Request:
     *   PUT http://localhost:8080/api/students/1
     *   Content-Type: application/json
     *
     * Body (chỉ gửi field muốn sửa):
     * {
     *   "fullname": "Nguyen Van B",
     *   "phone": "0987654321"
     * }
     *
     * Response (200 OK):
     * {
     *   "id": 1,
     *   "studentcode": "SV001",
     *   "fullname": "Nguyen Van B", // ← Đã đổi
     *   "phone": "0987654321",       // ← Đã đổi
     *   "email": "a@gmail.com"       // ← Giữ nguyên
     * }
     */
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(
            @PathVariable Long id,
            @RequestBody StudentUpdateRequest request
    ) {
        try {
            StudentResponse student = studentService.updateStudent(id, request);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * ==========================================
     * API 5: XÓA SINH VIÊN
     * ==========================================
     * Request:
     *   DELETE http://localhost:8080/api/students/1
     *
     * Response (200 OK):
     * "Xóa sinh viên thành công"
     *
     * Response (400 Bad Request):
     * "Không thể xóa sinh viên đã được liên kết với user"
     */
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            studentService.deleteStudent(id);
            return ResponseEntity.ok("Xóa sinh viên thành công");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}