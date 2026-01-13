package com.example.cms_quanlyhethong.config;

import com.example.cms_quanlyhethong.until.JwtUntil;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Set;
import java.util.stream.Collectors;

@Component
    public class JwtAuthenticationFilter implements Filter  {
    @Autowired
    private JwtUntil jwtUntil;
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;   //cast servletrequest thanh httpservletrequest
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        // lay token Header tu "Authozation"
        String authHeader = httpRequest.getHeader("Authorization");
        String token = null;
        String username = null;
        // kiem tra header co chưa Bearer khong
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.replace("Bearer ", "");
            try {
                //  Lấy username từ token
                username = jwtUntil.getUsernameFromToken(token);
            } catch (Exception e) {
                System.out.println("Token không hợp lệ: " + e.getMessage());
            }
        }
        // BƯỚC 4: Nếu có username và chưa được xác thực
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // BƯỚC 5: Validate token
            if (jwtUntil.validateToken(token) && !jwtUntil.isTokenExpired(token)) {

                // BƯỚC 6: Lấy roles từ token
                Set<String> roles = jwtUntil.getRoleFromToken(token);

                // BƯỚC 7: Chuyển roles thành authorities (thêm prefix "ROLE_")
                Set<SimpleGrantedAuthority> authorities = roles.stream()
                        .map(role -> new SimpleGrantedAuthority( role))
                        .collect(Collectors.toSet());

                // BƯỚC 8: Tạo Authentication object
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpRequest));

                // BƯỚC 9: Set authentication vào SecurityContext
                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("User authenticated: " + username + ", Roles: " + roles);
            }
        }

        // BƯỚC 10: Cho request đi tiếp
        filterChain.doFilter(request, response);
    }
}
