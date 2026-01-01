package com.senura.internship_portal_backend.config.security;

import io.jsonwebtoken.*;
import org.springframework.stereotype.Component;

import java.util.Date;

import io.jsonwebtoken.security.Keys;
import java.security.Key;

@Component
public class JwtUtils {

    // Use a fixed secret key for development to prevent token invalidation on
    // restart
    // In production, this should be in application.properties
    private static final String SECRET = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private final Key key = Keys.hmacShaKeyFor(io.jsonwebtoken.io.Decoders.BASE64.decode(SECRET));

    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
                .signWith(key)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
    }

    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().get("role",
                String.class);
    }
}
