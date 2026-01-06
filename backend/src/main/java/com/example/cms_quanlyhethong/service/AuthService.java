package com.example.cms_quanlyhethong.service;

import com.example.cms_quanlyhethong.dto.reponse.auth.LoginResponse;
import com.example.cms_quanlyhethong.dto.request.auth.LoginRequest;
import com.example.cms_quanlyhethong.entity.User;
import com.example.cms_quanlyhethong.repository.UserRepository;
import com.example.cms_quanlyhethong.entity.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    public LoginResponse Login(LoginRequest request) {
        // tim user theo username
        Optional<User>  userOptional = userRepository.findByUsername(request.getUsername());
        // kiem tra user ton tai
        if(userOptional.isEmpty())
        {
            throw new UsernameNotFoundException("Username not found");
        }
        User user = userOptional.get();
        //kiem tra password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Password không đúng!");
        }
        // kiem tra user co active khong
        if(!user.isActive()) {
            throw new RuntimeException("Tai khoan da bi khoa");
        }
        //B4 Convert Entity -> DTO
        // lay danh sach ten cac role
        Set<String> roleNames = user.getRoles().stream()
                .map(Role::getName) //lay nam moi role
                .collect(Collectors.toSet());
        // Tạo LoginResponse
        LoginResponse response = new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullname(),
                roleNames
        );
        // BƯỚC 5: Trả về response
        return response;
    }
}
