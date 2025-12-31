package com.example.cms_quanlyhethong.controller;

import com.example.cms_quanlyhethong.entity.User;
import com.example.cms_quanlyhethong.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    // lay tat ca user
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
