package com.example.cms_quanlyhethong.service;

import com.example.cms_quanlyhethong.dto.request.user.UserCreateRequest;
import com.example.cms_quanlyhethong.dto.request.user.UserUpdateRequest;
import com.example.cms_quanlyhethong.dto.response.user.UserResponse;
import com.example.cms_quanlyhethong.entity.Role;
import com.example.cms_quanlyhethong.entity.User;
import com.example.cms_quanlyhethong.mapper.UserMapper;
import com.example.cms_quanlyhethong.repository.RoleRepository;
import com.example.cms_quanlyhethong.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    // ========== CREATE USER ==========
    public UserResponse createUser(UserCreateRequest request) {
        // 1. Kiểm tra username đã tồn tại
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists: " + request.getUsername());
        }

        // 2. Kiểm tra email đã tồn tại
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }

        // 3. Tạo User entity
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Mã hóa password
        user.setEmail(request.getEmail());
        user.setFullname(request.getFullname());
        user.setActive(request.isActive());

        // 4. Gán roles
        Set<Role> roles = new HashSet<>();
        for (Long roleId : request.getRoleIds()) {
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleId));
            roles.add(role);
        }
        user.setRoles(roles);

        // 5. Lưu vào database
        User savedUser = userRepository.save(user);

        // 6. Convert sang DTO và return
        return userMapper.toResponse(savedUser);
    }

    // ========== GET ALL USERS ==========
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ========== GET USER BY ID ==========
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return userMapper.toResponse(user);
    }

    // ========== GET USER BY USERNAME ==========
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        return userMapper.toResponse(user);
    }

    // ========== UPDATE USER ==========
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        // 1. Tìm user
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // 2. Update username (nếu có)
        if (request.getUsername() != null) {
            // Kiểm tra username mới có trùng với user khác không
            if (!user.getUsername().equals(request.getUsername()) &&
                    userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username already exists: " + request.getUsername());
            }
            user.setUsername(request.getUsername());
        }

        // 3. Update password (nếu có)
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // 4. Update email (nếu có)
        if (request.getEmail() != null) {
            if (!user.getEmail().equals(request.getEmail()) &&
                    userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already exists: " + request.getEmail());
            }
            user.setEmail(request.getEmail());
        }

        // 5. Update fullname (nếu có)
        if (request.getFullname() != null) {
            user.setFullname(request.getFullname());
        }

        // 6. Update isActive (nếu có)
        if (request.getIsActive() != null) {
            user.setActive(request.getIsActive());
        }

        // 7. Update roles (nếu có)
        if (request.getRoleIds() != null && !request.getRoleIds().isEmpty()) {
            Set<Role> roles = new HashSet<>();
            for (Long roleId : request.getRoleIds()) {
                Role role = roleRepository.findById(roleId)
                        .orElseThrow(() -> new RuntimeException("Role not found: " + roleId));
                roles.add(role);
            }
            user.setRoles(roles);
        }

        // 8. Lưu và return
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    // ========== DELETE USER ==========
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        userRepository.delete(user);
    }

    // ========== ASSIGN ROLES ==========
    public UserResponse assignRoles(Long userId, Set<Long> roleIds) {
        // 1. Tìm user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // 2. Tìm roles
        Set<Role> roles = new HashSet<>();
        for (Long roleId : roleIds) {
            Role role = roleRepository.findById(roleId)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + roleId));
            roles.add(role);
        }

        // 3. Gán roles
        user.setRoles(roles);

        // 4. Lưu và return
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    // ========== GET USERS BY ROLE ==========
    public List<UserResponse> getUsersByRole(String roleName) {
        return userRepository.findByRoleName(roleName).stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ========== GET ACTIVE USERS ==========
    public List<UserResponse> getActiveUsers() {
        return userRepository.findByIsActive(true).stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ========== SEARCH USERS ==========
    public List<UserResponse> searchUsers(String keyword) {
        return userRepository.searchByKeyword(keyword).stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
    }

    // ========== ACTIVATE/DEACTIVATE USER ==========
    public UserResponse toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setActive(!user.isActive());
        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }
}