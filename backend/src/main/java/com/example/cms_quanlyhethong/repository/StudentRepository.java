package com.example.cms_quanlyhethong.repository;

import com.example.cms_quanlyhethong.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student,Long>
{
    // kiem tra ton tai ma sinh vien
    boolean existsByStudentCode(String studentcode);
    // kiem tra ton tai email
    boolean existsByEmail(String email);
    //tim kiem theo ma sinh vien
    Optional<Student> findByStudentCode(String studentcode);
    //tim kiem theo email sinh vien
    Optional<Student> findByEmail(String email);
}
