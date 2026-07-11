package com.dealership.vehicle;

import com.dealership.entity.Vehicle; // Import the entity from entity package!
import com.dealership.vehicle.dto.VehicleRequest;
import com.dealership.vehicle.dto.VehicleResponse;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    public Vehicle toEntity(VehicleRequest request) {
        return new Vehicle(
                request.make(),
                request.model(),
                request.category(),
                request.price(),
                request.quantityInStock()
        );
    }

    public VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getCategory(),
                vehicle.getPrice(),
                vehicle.getQuantityInStock()
        );
    }
}