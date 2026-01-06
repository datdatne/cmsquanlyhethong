package com.example.cms_quanlyhethong.controller;

import com.example.cms_quanlyhethong.dto.reponse.auth.LoginResponse;
import com.example.cms_quanlyhethong.dto.request.auth.LoginRequest;
import com.example.cms_quanlyhethong.entity.User;
import com.example.cms_quanlyhethong.repository.UserRepository;
import com.example.cms_quanlyhethong.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.Repository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    /**
     * API đăng nhập
     *
     * Request:
     * POST http://localhost:8080/api/auth/login
     * Body: {
     *   "username": "admin",
     *   "password": "123456"
     * }
     *
     * Response (Success - 200 OK):
     * {
     *   "token": "",
     *   "type": "Bearer",
     *   "userId": 1,
     *   "username": "admin",
     *   "email": "admin@example.com",
     *   "fullname": "Administrator",
     *   "roles": ["ADMIN", "TEACHER"]
     * }
     *
     * Response (Error - 400 Bad Request):
     * {
     *   "error": "Username không tồn tại!"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) // convert JSON thanh Loginrequest
    {
        try{
            // goi service xu li logic dang nhap
            LoginResponse user = authService.Login(request);
            // Trả về user (trong thực tế nên trả LoginResponse, không trả entity)
            return ResponseEntity.ok(user);
        }
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
