package com.identity.identityManager.utils;

import com.identity.identityManager.controller.AuthController;
import com.identity.identityManager.service.SecurityUser;
import io.jsonwebtoken.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;

@Service
public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    private final String SECRET_KEY = "secret";
    String encodedKey = Base64.getEncoder().encodeToString(SECRET_KEY.getBytes());

    public String generateToken(UserDetails userDetails) {
        SecurityUser customUserDetails = (SecurityUser) userDetails;
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", customUserDetails.getUser().getId());
        claims.put("username", customUserDetails.getUser().getUsername());
        claims.put("role", customUserDetails.getUser().getRole());
        claims.put("permission", customUserDetails.getUser().getPermissions());
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        long EXPIRE_TIME = 3600000;
        try {
            return Jwts.builder()
                    .setClaims(claims)
                    .setSubject(subject)
                    .setIssuedAt(new Date(System.currentTimeMillis()))
                    .setExpiration(new Date(System.currentTimeMillis() + EXPIRE_TIME))
                    .signWith(SignatureAlgorithm.HS256, encodedKey)
                    .compact();
        } catch (JwtException e) {
            logger.error("Error generating JWT: {}", e.getMessage());
            throw new RuntimeException("JWT generation failed");
        }


    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Map<String, Object> getValidatedUserDetails(String token){
        Map<String, Object> response = new HashMap<>(Map.of());
        response.put("id",getValueFromToken(token, "id"));
        response.put("username",extractClaim(token, Claims::getSubject));
        response.put("permissions",getPermissionsFromToken(token));
        response.put("role",getValueFromToken(token, "role"));
        response.put("exp",extractClaim(token, Claims::getExpiration));
        response.put("iat",extractClaim(token, Claims::getIssuedAt));
        return response;
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private List<Object> getPermissionsFromToken(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("permission", List.class);
    }

    private Object getValueFromToken(String token, String value) {
        Claims claims = extractAllClaims(token);
        return claims.get(value);

    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(encodedKey)
                .parseClaimsJws(token)
                .getBody();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    public Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}

