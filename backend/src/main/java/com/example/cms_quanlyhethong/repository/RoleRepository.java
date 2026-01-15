package com.example.cms_quanlyhethong.repository;

import com.example.cms_quanlyhethong.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Long>
{
    // Tìm role theo tên (ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT)
    Optional<Role> findByName(String name);

    // Kiểm tra role có tồn tại không
    boolean existsByName(String name);
}
