package com.dealership.vehicle.dto;
import java.math.BigDecimal;
import java.util.UUID;
public record VehicleResponse(UUID id, String make, String model, String category, BigDecimal price, Integer quantityInStock) {}