package com.dealership.auth;

import com.dealership.auth.dto.AuthResponse;
import com.dealership.auth.dto.RegisterRequest;
import com.dealership.entity.Role;
import com.dealership.entity.User;
import com.dealership.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    // AuthService.java
    private final UserDetailsService userDetailsService; // Add this field

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, UserDetailsService userDetailsService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService; // Add this line
    }


    public AuthResponse register(RegisterRequest request) {
        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);

        // Save and use the saved entity
        User savedUser = userRepository.save(user);

        // Since 'savedUser' implements UserDetails, you can pass it directly!
        String token = jwtService.generateToken(savedUser);
        return new AuthResponse(token);
    }

    public AuthResponse refresh(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new com.dealership.exception.InvalidTokenException("Invalid token format");
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractUsername(token);

        // Load the user details
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Explicitly validate the token against the loaded user details
        if (!jwtService.isTokenValid(token, userDetails)) {
            throw new com.dealership.exception.InvalidTokenException("Token is invalid or expired");
        }

        return new AuthResponse(jwtService.generateToken(userDetails));
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }



}