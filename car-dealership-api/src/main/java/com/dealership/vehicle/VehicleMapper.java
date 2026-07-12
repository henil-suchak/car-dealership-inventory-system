package com.dealership.vehicle;

import com.dealership.entity.Vehicle; // Import the entity from entity package!
import com.dealership.vehicle.dto.VehicleRequest;
import com.dealership.vehicle.dto.VehicleResponse;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    public Vehicle toEntity(VehicleRequest request) {
        Vehicle vehicle = new Vehicle(
                request.make(),
                request.model(),
                request.category(),
                request.price(),
                request.quantityInStock()
        );
        vehicle.setYear(request.year());
        vehicle.setMileage(request.mileage());
        vehicle.setVin(request.vin());
        vehicle.setTrimLevel(request.trimLevel());
        vehicle.setEngineType(request.engineType());
        vehicle.setTransmission(request.transmission());
        vehicle.setColor(request.color());
        vehicle.setStatus(request.status());
        return vehicle;
    }

    public VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
                vehicle.getId(),
                vehicle.getMake(),
                vehicle.getModel(),
                vehicle.getCategory(),
                vehicle.getPrice(),
                vehicle.getQuantityInStock(),
                vehicle.getYear(),
                vehicle.getMileage(),
                vehicle.getVin(),
                vehicle.getTrimLevel(),
                vehicle.getEngineType(),
                vehicle.getTransmission(),
                vehicle.getColor(),
                vehicle.getStatus()
        );
    }
}