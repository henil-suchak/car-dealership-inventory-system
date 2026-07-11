package com.dealership.controller;

import com.dealership.auth.dto.AuthResponse;
import com.dealership.auth.dto.LoginRequest;
import com.dealership.auth.dto.RegisterRequest;
import com.dealership.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user registration, login, and token management")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account and returns JWT tokens")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }
    
    @PostMapping("/refresh")
    @Operation(summary = "Refresh JWT", description = "Uses a valid refresh token to obtain a new short-lived access token")
    public ResponseEntity<AuthResponse> refresh(@RequestBody com.dealership.auth.dto.RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refresh(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Invalidates the current session")
    public ResponseEntity<Void> logout() {
        authService.logout();
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates a user and returns JWT access and refresh tokens")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}