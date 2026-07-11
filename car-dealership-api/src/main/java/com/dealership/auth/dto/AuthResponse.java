package com.dealership.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Response containing JWT tokens")
public record AuthResponse(
    @Schema(description = "Short-lived JWT access token") String token,
    @Schema(description = "Long-lived JWT refresh token") String refreshToken
) {
}