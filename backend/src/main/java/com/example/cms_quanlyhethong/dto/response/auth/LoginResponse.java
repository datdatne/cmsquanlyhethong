package com.example.cms_quanlyhethong.dto.response.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token; // token
    private String type; //loai token
    private Long id;
    private String username;
    private String email;
    private String fullname;
    private Set<String> roles;

    public LoginResponse(Long id, String username, String email,
                         String fullname, Set<String> roles) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullname = fullname;
        this.roles = roles;
        this.type = "Bearer";
        this.token = ""; // Tạm thời để trống
    }
}
