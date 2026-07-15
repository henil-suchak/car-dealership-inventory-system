package com.dealership.service;

import com.dealership.entity.Vehicle;
import com.dealership.exception.OutOfStockException;
import com.dealership.exception.ResourceNotFoundException;
import com.dealership.repository.VehicleRepository;
import com.dealership.vehicle.VehicleMapper;
import com.dealership.vehicle.dto.VehicleResponse;
import com.dealership.entity.Purchase;
import com.dealership.repository.PurchaseRepository;
import java.time.LocalDateTime;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class InventoryService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;
    private final PurchaseRepository purchaseRepository;

    public InventoryService(VehicleRepository vehicleRepository, VehicleMapper vehicleMapper, PurchaseRepository purchaseRepository) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleMapper = vehicleMapper;
        this.purchaseRepository = purchaseRepository;
    }

    @Transactional
    public VehicleResponse purchaseVehicle(UUID id, com.dealership.entity.User user) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        if (vehicle.getQuantityInStock() <= 0) {
            throw new OutOfStockException("Vehicle is completely out of stock.");
        }

        vehicle.setQuantityInStock(vehicle.getQuantityInStock() - 1);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        Purchase purchase = new Purchase(user, savedVehicle, LocalDateTime.now(), savedVehicle.getPrice());
        purchaseRepository.save(purchase);

        return vehicleMapper.toResponse(savedVehicle);
    }

    @Transactional
    public VehicleResponse restockVehicle(UUID id, int quantity) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        vehicle.setQuantityInStock(vehicle.getQuantityInStock() + quantity);
        return vehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }
}
