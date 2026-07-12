package com.dealership.vehicle.dto;
import com.dealership.entity.VehicleStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import java.math.BigDecimal;
import java.util.UUID;
@Schema(description = "Response containing vehicle details")
public record VehicleResponse(
    @Schema(description = "Unique ID of the vehicle") UUID id, 
    @Schema(description = "Manufacturer of the vehicle", example = "Toyota") String make, 
    @Schema(description = "Model of the vehicle", example = "Camry") String model, 
    @Schema(description = "Category of the vehicle", example = "SEDAN") String category, 
    @Schema(description = "Price of the vehicle", example = "25000.00") BigDecimal price, 
    @Schema(description = "Number of vehicles in stock", example = "10") Integer quantityInStock,
    @Schema(description = "Year of the vehicle", example = "2024") Integer year,
    @Schema(description = "Mileage of the vehicle", example = "15000") Integer mileage,
    @Schema(description = "Vehicle Identification Number") String vin,
    @Schema(description = "Trim level", example = "XLE") String trimLevel,
    @Schema(description = "Engine type", example = "V6") String engineType,
    @Schema(description = "Transmission type", example = "Automatic") String transmission,
    @Schema(description = "Color of the vehicle", example = "Silver") String color,
    @Schema(description = "Vehicle status") VehicleStatus status
) {}