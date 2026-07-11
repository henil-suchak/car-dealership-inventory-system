package com.dealership.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request payload for user registration")
public record RegisterRequest(
    @Schema(description = "User's username", example = "johndoe") String username,
    @Schema(description = "User's email address", example = "user@example.com") String email,
    @Schema(description = "User's password", example = "securepassword") String password
) {
}