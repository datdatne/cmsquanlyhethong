package com.example.cms_quanlyhethong.dto.request.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/*
    DTO nhận dữ liệu từ client khi đăng nhập
    Client gửi password và username lên server
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String username;
    private String password;

}
