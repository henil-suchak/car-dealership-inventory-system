package com.dealership.vehicle.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record PurchaseResponse(
    UUID id,
    String make,
    String model,
    String category,
    String vin,
    BigDecimal price,
    LocalDateTime date,
    String signature
) {}
