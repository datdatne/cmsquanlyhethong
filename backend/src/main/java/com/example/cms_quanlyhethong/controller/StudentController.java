package com.example.cms_quanlyhethong.controller;

import com.example.cms_quanlyhethong.entity.Student;
import com.example.cms_quanlyhethong.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Controller
@RequestMapping("api/student")
public class StudentController {
    @Autowired
    private StudentRepository studentRepository;
        @GetMapping
        @PreAuthorize("hasAnyRole('ADMIN','TEACHER')")
        public List<Student> getAllStudents() {
            return studentRepository.findAll();
        }

}
