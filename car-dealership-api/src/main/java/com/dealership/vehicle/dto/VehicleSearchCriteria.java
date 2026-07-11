package com.dealership.vehicle.dto;

import java.math.BigDecimal;

public record VehicleSearchCriteria(
    String make,
    String model,
    String category,
    BigDecimal minPrice,
    BigDecimal maxPrice
) {}
