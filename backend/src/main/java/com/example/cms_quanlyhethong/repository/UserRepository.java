package com.example.cms_quanlyhethong.repository;

import com.example.cms_quanlyhethong.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>
{
// Quy tắc đặt tên method trong Spring Data JPA:

    // 1. Tìm theo 1 field
    Optional<User> findByUsername(String username);
// → SELECT * FROM users WHERE username = ?

    // 2. Tìm theo nhiều field (AND)
    Optional<User> findByUsernameAndPassword(String username, String password);
// → SELECT * FROM users WHERE username = ? AND password = ?

    // 3. Tìm theo nhiều field (OR)
    List<User> findByUsernameOrEmail(String username, String email);
// → SELECT * FROM users WHERE username = ? OR email = ?

    // 4. Kiểm tra tồn tại
    boolean existsByUsername(String username);
// → SELECT COUNT(*) FROM users WHERE username = ?

    // 5. Đếm số lượng
    long countByIsActive(boolean isActive);
// → SELECT COUNT(*) FROM users WHERE is_active = ?
}
