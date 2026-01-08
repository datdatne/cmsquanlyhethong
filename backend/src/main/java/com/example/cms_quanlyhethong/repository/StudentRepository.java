package com.example.cms_quanlyhethong.repository;

import com.example.cms_quanlyhethong.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student,Long>
{
    // kiem tra ton tai ma sinh vien
    boolean exitByStudentCode(String studentCode);
    // kiem tra ton tai email
    boolean exitByEmail(String email);
    //tim kiem theo ma sinh vien
    Optional<Student> findByStudentCode(String studentCode);
    //tim kiem theo email sinh vien
    Optional<Student> findByEmail(String email);
}
