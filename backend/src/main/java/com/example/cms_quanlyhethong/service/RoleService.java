package com.example.cms_quanlyhethong.service;

import com.example.cms_quanlyhethong.entity.Role;
import com.example.cms_quanlyhethong.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.cms_quanlyhethong.dto.request.role.RoleRequest;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;

    // ========== GET ALL ROLES ==========
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    // ========== GET ROLE BY ID ==========
    public Role getRoleById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
    }

    // ========== GET ROLE BY NAME ==========
    public Role getRoleByName(String name) {
        return roleRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Role not found with name: " + name));
    }

    // ========== CREATE ROLE ==========
    public Role createRole(RoleRequest request) {
        // Kiểm tra role đã tồn tại
        if (roleRepository.existsByName(request.getName())) {
            throw new RuntimeException("Role already exists: " + request.getName());
        }

        Role role = new Role();
        role.setName(request.getName());
        role.setDescription(request.getDescription());

        return roleRepository.save(role);
    }

    // ========== UPDATE ROLE ==========
    public Role updateRole(Long id, RoleRequest request) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));

        // Kiểm tra tên mới có trùng với role khác không
        if (!role.getName().equals(request.getName()) && roleRepository.existsByName(request.getName())) {
            throw new RuntimeException("Role name already exists: " + request.getName());
        }

        role.setName(request.getName());
        role.setDescription(request.getDescription());

        return roleRepository.save(role);
    }

    // ========== DELETE ROLE ==========
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
        roleRepository.delete(role);
    }
}