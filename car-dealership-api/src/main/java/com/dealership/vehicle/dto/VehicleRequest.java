package com.dealership.vehicle.dto;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
public record VehicleRequest(
        @NotBlank(message = "Make is required") String make,
        @NotBlank(message = "Model is required") String model,
        @NotBlank(message = "Category is required") String category,
        @NotNull(message = "Price is required") @DecimalMin("0.0") BigDecimal price,
        @NotNull(message = "Quantity is required") @Min(0) Integer quantityInStock
) {}