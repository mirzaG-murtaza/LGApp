package com.identity.identityManager.controller;

import com.identity.identityManager.model.User;
import com.identity.identityManager.repository.UserRepository;
import com.identity.identityManager.service.CustomUserDetailsService;
import com.identity.identityManager.utils.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);


    @PostMapping("/register")
    public  ResponseEntity<String> registerUser(@RequestBody User user) {
        try {
            logger.info("Received request to create user: {}", user);

            Optional<User> existingUser = Optional.ofNullable(userRepository.findByUsername(user.getUsername()));
            if (existingUser.isPresent()) {
                logger.warn("User with username {} already exists", user.getUsername());
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            userRepository.save(user);

            logger.info("User created successfully: {}", user);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            logger.error("Error occurred while registering user: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to register user");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> createToken(@RequestBody User user) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword())
            );

            final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            final String jwt = jwtUtil.generateToken(userDetails);

            return ResponseEntity.ok(jwt);
        } catch (AuthenticationException e) {
            logger.error("Authentication failed for user: {}", user.getUsername(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");
        } catch (Exception e) {
            logger.error("An error occurred during token creation for user: {}", user.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while generating the token");
        }
    }

//    @GetMapping("/validateToken")
//    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
//        String jwt = token.substring(7);
//        Map<String, Object> response = jwtUtil.getValidatedUserDetails(jwt);
//
//        if (jwtUtil.isTokenExpired(jwt)) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token has expired");
//        }
//
//        return ResponseEntity.ok("Token is valid. User: " + response);
//    }
@GetMapping("/validateToken")
public ResponseEntity<Map<String, Object>> validateToken(@RequestHeader(value = "Authorization", required = false) String token) {
    Map<String, Object> response = new HashMap<>();

    if (token == null || !token.startsWith("Bearer ")) {
        response.put("status", "error");
        response.put("message", "Missing or malformed Authorization header");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    String jwt = token.substring(7);

    try {
        if (jwtUtil.isTokenExpired(jwt)) {
            response.put("status", "error");
            response.put("message", "Token has expired");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        Map<String, Object> userDetails = jwtUtil.getValidatedUserDetails(jwt);
        response.put("status", "success");
        response.put("message", "Token is valid");
        response.put("user", userDetails);

        return ResponseEntity.ok(response);

    } catch (Exception e) {
        response.put("status", "error");
        response.put("message", "An error occurred while validating the token: " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
}

