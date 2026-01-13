package com.example.cms_quanlyhethong.service;

import com.example.cms_quanlyhethong.dto.request.student.StudentCreateRequest;
import com.example.cms_quanlyhethong.dto.request.student.StudentUpdateRequest;
import com.example.cms_quanlyhethong.dto.response.student.StudentResponse;
import com.example.cms_quanlyhethong.entity.Student;
import com.example.cms_quanlyhethong.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;
    /**
     * ==========================================
     * 0. CONVERT ENTITY → DTO (Private method)
     * ==========================================
     * Method này CHỈ dùng nội bộ trong Service
     * Mục đích: Tránh lặp code convert
     */
    private StudentResponse convertToResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getStudentCode(),
                student.getFullName(),
                student.getDateOfBirth(),
                student.getEmail(),
                student.getPhone(),
                student.getAddress(),
                student.getMajor(),
                student.getClassName(),
                student.getCreatedAt(),
                student.getUpdatedAt()
        );
    }
    /**
     * ==========================================
     * 1. LẤY TẤT CẢ SINH VIÊN
     * ==========================================
     * Luồng:
     * 1. Gọi Repository lấy List<Student> từ DB
     * 2. Convert từng Student → StudentResponse
     * 3. Trả về List<StudentResponse>
     */
    public List<StudentResponse> getAllStudents() {
        // Lấy tất cả sinh viên từ DB
        List<Student> students = studentRepository.findAll();

        // Convert List<Student> → List<StudentResponse>
        return students.stream()
                .map(this::convertToResponse)  // Gọi method convertToResponse cho từng student
                .collect(Collectors.toList());
    }

    /**
     * ==========================================
     * 2. LẤY 1 SINH VIÊN THEO ID
     * ==========================================
     * Luồng:
     * 1. Gọi Repository tìm Student theo ID
     * 2. Nếu không tìm thấy → throw Exception
     * 3. Nếu tìm thấy → Convert sang StudentResponse
     */
    public StudentResponse getStudentById(Long id) {
        // Tìm sinh viên, nếu không có thì throw exception
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với ID: " + id));

        // Convert Entity → DTO
        return convertToResponse(student);
    }

    /**
     * ==========================================
     * 3. TẠO SINH VIÊN MỚI
     * ==========================================
     * Luồng:
     * 1. Validate: Check mã SV đã tồn tại chưa
     * 2. Validate: Check email đã tồn tại chưa
     * 3. Convert DTO → Entity
     * 4. Lưu vào DB
     * 5. Convert Entity → DTO trả về
     */
    public StudentResponse createStudent(StudentCreateRequest request) {
        // BƯỚC 1: Validate mã sinh viên
        if (studentRepository.existsByStudentCode(request.getStudentcode())) {
            throw new RuntimeException("Mã sinh viên đã tồn tại: " + request.getStudentcode());
        }

        // BƯỚC 2: Validate email
        if (studentRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại: " + request.getEmail());
        }

        // BƯỚC 3: Convert DTO → Entity
        Student student = new Student();
        student.setStudentCode(request.getStudentcode());
        student.setFullName(request.getFullname());
        student.setDateOfBirth(request.getDateofbirth());
        student.setEmail(request.getEmail());
        student.setPhone(request.getPhone());
        student.setAddress(request.getAddress());
        student.setMajor(request.getMajor());
        student.setClassName(request.getClassname());
        // createdAt, updatedAt tự động set bởi @CreationTimestamp, @UpdateTimestamp

        // BƯỚC 4: Lưu vào DB
        Student savedStudent = studentRepository.save(student);

        // BƯỚC 5: Convert Entity → DTO và trả về
        return convertToResponse(savedStudent);
    }

    /**
     * ==========================================
     * 4. CẬP NHẬT SINH VIÊN
     * ==========================================
     * Luồng:
     * 1. Tìm sinh viên theo ID (không tìm thấy → throw)
     * 2. Validate: Nếu sửa email → check trùng với SV khác không
     * 3. Update các field (chỉ update field nào != null)
     * 4. Lưu vào DB
     * 5. Convert Entity → DTO trả về
     */
    public StudentResponse updateStudent(Long id, StudentUpdateRequest request) {
        // BƯỚC 1: Tìm sinh viên cần update
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với ID: " + id));

        // BƯỚC 2: Validate email (nếu có thay đổi)
        if (request.getEmail() != null && !request.getEmail().equals(student.getEmail())) {
            if (studentRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email đã tồn tại: " + request.getEmail());
            }
        }

        // BƯỚC 3: Update các field (chỉ update nếu != null)
        if (request.getFullname() != null) {
            student.setFullName(request.getFullname());
        }
        if (request.getDateofbirth() != null) {
            student.setDateOfBirth(request.getDateofbirth());
        }
        if (request.getEmail() != null) {
            student.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) {
            student.setPhone(request.getPhone());
        }
        if (request.getAddress() != null) {
            student.setAddress(request.getAddress());
        }
        if (request.getMajor() != null) {
            student.setMajor(request.getMajor());
        }
        if (request.getClassname() != null) {
            student.setClassName(request.getClassname());
        }

        // BƯỚC 4: Lưu vào DB
        Student updatedStudent = studentRepository.save(student);

        // BƯỚC 5: Convert Entity → DTO và trả về
        return convertToResponse(updatedStudent);
    }

    /**
     * ==========================================
     * 5. XÓA SINH VIÊN
     * ==========================================
     * Luồng:
     * 1. Tìm sinh viên theo ID (không tìm thấy → throw)
     * 2. Kiểm tra xem sinh viên có liên kết với User không
     * 3. Nếu có → không cho xóa (để tránh orphan data)
     * 4. Nếu không → xóa
     */
    public void deleteStudent(Long id) {
        // BƯỚC 1: Tìm sinh viên
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên với ID: " + id));

        // BƯỚC 2: Kiểm tra liên kết với User
        if (student.getUser() != null) {
            throw new RuntimeException(
                    "Không thể xóa sinh viên đã được liên kết với user. " +
                            "Vui lòng xóa user trước hoặc hủy liên kết."
            );
        }

        // BƯỚC 3: Xóa
        studentRepository.deleteById(id);
    }


}