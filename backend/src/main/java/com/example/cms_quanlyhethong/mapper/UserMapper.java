package com.example.cms_quanlyhethong.mapper;

import com.example.cms_quanlyhethong.dto.response.user.UserResponse;
import com.example.cms_quanlyhethong.entity.Role;
import com.example.cms_quanlyhethong.entity.Student;
import com.example.cms_quanlyhethong.entity.User;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class UserMapper {

    // Convert User Entity → UserResponse DTO
    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullname(user.getFullname())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .roles(user.getRoles().stream()
                        .map(this::roleToRoleResponse)
                        .collect(Collectors.toSet()))
                .student(user.getStudent() != null ? studentToBasicInfo(user.getStudent()) : null)
                .build();
    }

    // Convert Role → RoleResponse
    private UserResponse.RoleResponse roleToRoleResponse(Role role) {
        return UserResponse.RoleResponse.builder()
                .id(role.getId())
                .name(role.getName())
                .description(role.getDescription())
                .build();
    }

    // Convert Student → StudentBasicInfo
    private UserResponse.StudentBasicInfo studentToBasicInfo(Student student) {
        return UserResponse.StudentBasicInfo.builder()
                .id(student.getId())
                .studentCode(student.getStudentCode())
                .fullName(student.getFullName())
                .email(student.getEmail())
                .build();
    }
}