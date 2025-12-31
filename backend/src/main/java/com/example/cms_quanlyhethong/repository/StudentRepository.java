package com.example.cms_quanlyhethong.repository;

import com.example.cms_quanlyhethong.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student,Long>
{
}
