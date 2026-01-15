package com.example.cms_quanlyhethong.dto.response.user;

import lombok.*;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullname;
    private boolean isActive;
    private Date createdAt;
    private Date updatedAt;
    private Set<RoleResponse> roles;
    private StudentBasicInfo student;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoleResponse {
        private Long id;
        private String name;
        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StudentBasicInfo {
        private Long id;
        private String studentCode;
        private String fullName;
        private String email;
    }
}