package com.example.cms_quanlyhethong.controller;

import com.example.cms_quanlyhethong.dto.request.user.UserCreateRequest;
import com.example.cms_quanlyhethong.dto.request.user.UserUpdateRequest;
import com.example.cms_quanlyhethong.dto.response.user.UserResponse;
import com.example.cms_quanlyhethong.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 1. Tạo mới người dùng
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody UserCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
    }

    // 2. Lấy danh sách tất cả người dùng
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // 3. Lấy người dùng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    // 4. Lấy người dùng theo Username
    @GetMapping("/username/{username}")
    public ResponseEntity<UserResponse> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }

    // 5. Cập nhật thông tin người dùng
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @RequestBody  UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    // 6. Xóa người dùng
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // 7. Gán quyền (Roles) cho người dùng
    @PatchMapping("/{id}/roles")
    public ResponseEntity<UserResponse> assignRoles(
            @PathVariable Long id,
            @RequestBody Set<Long> roleIds) {
        return ResponseEntity.ok(userService.assignRoles(id, roleIds));
    }

    // 8. Lấy danh sách người dùng theo tên quyền
    @GetMapping("/role/{roleName}")
    public ResponseEntity<List<UserResponse>> getUsersByRole(@PathVariable String roleName) {
        return ResponseEntity.ok(userService.getUsersByRole(roleName));
    }

    // 9. Lấy danh sách người dùng đang hoạt động
    @GetMapping("/active")
    public ResponseEntity<List<UserResponse>> getActiveUsers() {
        return ResponseEntity.ok(userService.getActiveUsers());
    }

    // 10. Tìm kiếm người dùng theo từ khóa (username, email, fullname)
    @GetMapping("/search")
    public ResponseEntity<List<UserResponse>> searchUsers(@RequestParam String keyword) {
        return ResponseEntity.ok(userService.searchUsers(keyword));
    }

    // 11. Đảo trạng thái hoạt động (Kích hoạt/Khóa)
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<UserResponse> toggleUserStatus(@PathVariable Long id) {
        return ResponseEntity.ok(userService.toggleUserStatus(id));
    }
}