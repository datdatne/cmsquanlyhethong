package com.example.cms_quanlyhethong.dto.request.user;

import lombok.*;

import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserCreateRequest {

    private String username;

    private String password;

    private String email;

    private String fullname;

    private Boolean isActive = true;

    private Set<Long> roleIds;  // Danh sách ID của roles
}