package com.dealership.vehicle.dto;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
@Schema(description = "Request payload for creating or updating a vehicle")
public record VehicleRequest(
        @Schema(description = "Manufacturer of the vehicle", example = "Toyota") @NotBlank(message = "Make is required") String make,
        @Schema(description = "Model of the vehicle", example = "Camry") @NotBlank(message = "Model is required") String model,
        @Schema(description = "Category of the vehicle (e.g., SEDAN, SUV)", example = "SEDAN") @NotBlank(message = "Category is required") String category,
        @Schema(description = "Price of the vehicle", example = "25000.00") @NotNull(message = "Price is required") @DecimalMin("0.0") BigDecimal price,
        @Schema(description = "Number of vehicles in stock", example = "10") @NotNull(message = "Quantity is required") @Min(0) Integer quantityInStock
) {}