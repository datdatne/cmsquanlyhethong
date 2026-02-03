package com.example.cms_quanlyhethong.controller;

import com.example.cms_quanlyhethong.entity.Role;
import com.example.cms_quanlyhethong.repository.RoleRepository;
import com.example.cms_quanlyhethong.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import com.example.cms_quanlyhethong.dto.request.role.RoleRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "http://localhost:3000")
public class RoleController {

    @Autowired
    private RoleService roleService;  // ← THÊM @Autowired



    @GetMapping
    public List<Role> getAllRoles() {
        return roleService.getAllRoles();  // ← Gọi qua instance
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Role getRoleById(@PathVariable Long id) {
        return roleService.getRoleById(id);
    }
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createRole(@RequestBody RoleRequest request) {
        try {
            Role role = roleService.createRole(request);
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody RoleRequest request) {
        try {
            Role role = roleService.updateRole(id, request);
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRole(@PathVariable Long id) {
        try {
            roleService.deleteRole(id);
            return ResponseEntity.ok("Xóa role thành công!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}