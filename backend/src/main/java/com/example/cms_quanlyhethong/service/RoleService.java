package com.example.cms_quanlyhethong.service;

import com.example.cms_quanlyhethong.entity.Role;
import com.example.cms_quanlyhethong.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    public Role createRole(String name, String description) {
        // Kiểm tra role đã tồn tại
        if (roleRepository.existsByName(name)) {
            throw new RuntimeException("Role already exists: " + name);
        }

        Role role = new Role();
        role.setName(name);
        role.setDescription(description);

        return roleRepository.save(role);
    }

    // ========== UPDATE ROLE ==========
    public Role updateRole(Long id, String name, String description) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));

        // Kiểm tra tên mới có trùng với role khác không
        if (!role.getName().equals(name) && roleRepository.existsByName(name)) {
            throw new RuntimeException("Role name already exists: " + name);
        }

        role.setName(name);
        role.setDescription(description);

        return roleRepository.save(role);
    }

    // ========== DELETE ROLE ==========
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found with id: " + id));
        roleRepository.delete(role);
    }
}