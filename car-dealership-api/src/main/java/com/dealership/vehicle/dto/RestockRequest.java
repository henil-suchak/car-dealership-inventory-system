package com.dealership.vehicle.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

@Schema(description = "Request payload for restocking a vehicle")
public record RestockRequest(
    @Schema(description = "Number of vehicles to add to stock", example = "5")
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Restock quantity must be at least 1")
    Integer quantity
) {}
