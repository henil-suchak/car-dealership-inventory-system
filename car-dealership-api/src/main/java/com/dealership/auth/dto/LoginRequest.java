package com.dealership.auth.dto;
import io.swagger.v3.oas.annotations.media.Schema;
@Schema(description = "Request payload for user login")
public record LoginRequest(
    @Schema(description = "User's email address", example = "admin@dealership.com") String email,
    @Schema(description = "User's password", example = "password123") String password
) {}