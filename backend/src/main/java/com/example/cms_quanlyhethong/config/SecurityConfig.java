package com.example.cms_quanlyhethong.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // ← THÊM DÒNG NÀY: Cho phép /api/auth/** không cần xác thực
                        .anyRequest().permitAll() // Cho phép tất cả request khác
                )
                .httpBasic(basic -> basic.disable()); // ← THÊM DÒNG NÀY: Tắt HTTP Basic Auth

        return http.build();
    }
}