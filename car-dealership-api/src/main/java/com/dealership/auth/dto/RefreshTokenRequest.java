package com.dealership.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Request payload to refresh JWT token")
public record RefreshTokenRequest(
    @Schema(description = "The valid refresh token") String refreshToken
) {
}
