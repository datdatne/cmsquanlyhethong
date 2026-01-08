package com.example.cms_quanlyhethong.until;

import com.example.cms_quanlyhethong.CmsQuanlyhethongApplication;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.SpringApplication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@Component
public class JwtUntil {
    // tao ra khoa bi mat de ma hoa token
    private final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    // tao ra thoi gian token co hieu luc
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;
    /*
    tao JWT token tu UserName và Role
    @param username - ten dang nhap
    @param role - danh sach role user
    @retuen JWT token string
     */
    public String generateToken(String username , Set<String> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles); // them roles vao token
        return Jwts.builder()
                .setClaims(claims) // them thong tin roles
                .setSubject(username) // them user
                .setIssuedAt(new Date()) // thoi gian tao token
                .setExpiration(new Date(System.currentTimeMillis()+EXPIRATION_TIME)) // thoi gian token het hieu luc
                .signWith(SECRET_KEY) // ky token bang khoa bi mat
        .compact();
    }
    /*
    Lay user name tu token
     */
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }
    /*
    Lay role tu token
     */
    public Set<String> getRoleFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return (Set<String>) claims.get("roles");
    }
    /*
    Kiem tra token co hop le hay khong
     */
    public boolean validateToken(String token) {
        try{
            Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .build()
                    .parseClaimsJws(token);
            return true;
        }
        catch(Exception e){
            return false;
        }
    }
    /*
    Kiem tra token co het han hay chua
     */
    public boolean isTokenExpired(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return claims.getExpiration().before(new Date());
    }

}
