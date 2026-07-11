package com.dealership.service;

import com.dealership.entity.Vehicle;
import com.dealership.repository.VehicleRepository;
import com.dealership.vehicle.VehicleMapper;
import com.dealership.vehicle.dto.VehicleRequest;
import com.dealership.vehicle.dto.VehicleResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleService(VehicleRepository vehicleRepository, VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleMapper = vehicleMapper;
    }

    @Transactional
    public VehicleResponse createVehicle(VehicleRequest request) {
        Vehicle vehicle = vehicleMapper.toEntity(request);
        return vehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    @Transactional(readOnly = true)
    public Page<VehicleResponse> getAllVehicles(Pageable pageable) {
        return vehicleRepository.findAll(pageable).map(vehicleMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public Page<VehicleResponse> searchVehicles(com.dealership.vehicle.dto.VehicleSearchCriteria criteria, Pageable pageable) {
        if (criteria.minPrice() != null && criteria.maxPrice() != null && criteria.minPrice().compareTo(criteria.maxPrice()) > 0) {
            throw new IllegalArgumentException("minPrice cannot be greater than maxPrice");
        }
        return vehicleRepository.findAll(com.dealership.vehicle.VehicleSpecification.withCriteria(criteria), pageable)
                .map(vehicleMapper::toResponse);
    }

    @Transactional
    public VehicleResponse updateVehicle(UUID id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new com.dealership.exception.ResourceNotFoundException("Vehicle not found with id: " + id));

        vehicle.setMake(request.make());
        vehicle.setModel(request.model());
        vehicle.setCategory(request.category());
        vehicle.setPrice(request.price());
        vehicle.setQuantityInStock(request.quantityInStock());

        return vehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    @Transactional
    public void deleteVehicle(UUID id) {
        if (!vehicleRepository.existsById(id)) {
            throw new com.dealership.exception.ResourceNotFoundException("Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }
}