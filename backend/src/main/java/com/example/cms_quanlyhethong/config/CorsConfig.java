package com.example.cms_quanlyhethong.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * ============================================
 * CORS CONFIGURATION
 * ============================================
 *
 * CORS = Cross-Origin Resource Sharing
 *
 * VẤN ĐỀ:
 * - Frontend chạy ở localhost:3000
 * - Backend chạy ở localhost:8080
 * - Browser chặn request giữa 2 domain khác nhau (bảo mật)
 *
 * GIẢI PHÁP:
 * - Backend phải "cho phép" Frontend truy cập
 * - Thông qua header: Access-Control-Allow-Origin
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 1. Cho phép origin nào được truy cập
        // localhost:3000 = địa chỉ Frontend React
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://127.0.0.1:3000"
        ));

        // 2. Cho phép các HTTP methods nào
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));

        // 3. Cho phép các headers nào
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",      // Để gửi JWT token
                "Content-Type",       // Để gửi JSON
                "X-Requested-With",
                "Accept",
                "Origin"
        ));

        // 4. Cho phép gửi credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);

        // 5. Cache preflight request trong 3600 giây (1 tiếng)
        configuration.setMaxAge(3600L);

        // Áp dụng cho tất cả các URL
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}