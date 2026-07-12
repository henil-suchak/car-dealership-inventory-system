package com.dealership.controller;

import com.dealership.service.VehicleService;
import com.dealership.vehicle.dto.VehicleRequest;
import com.dealership.vehicle.dto.VehicleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Vehicles", description = "Endpoints for vehicle CRUD and search operations")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new vehicle", description = "Requires ADMIN role.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<VehicleResponse> createVehicle(@Valid @RequestBody VehicleRequest request) {
        return new ResponseEntity<>(vehicleService.createVehicle(request), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all vehicles", description = "Retrieves a paginated list of all vehicles. No authentication required.")
    public ResponseEntity<Page<VehicleResponse>> getAllVehicles(Pageable pageable) {
        return ResponseEntity.ok(vehicleService.getAllVehicles(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a vehicle by ID", description = "Retrieves a single vehicle by its UUID. No authentication required.")
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable UUID id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @GetMapping("/search")
    @Operation(summary = "Search vehicles", description = "Dynamically filter vehicles by make, model, category, and price range. No authentication required.")
    public ResponseEntity<Page<VehicleResponse>> searchVehicles(
            @ModelAttribute com.dealership.vehicle.dto.VehicleSearchCriteria criteria,
            Pageable pageable) {
        return ResponseEntity.ok(vehicleService.searchVehicles(criteria, pageable));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing vehicle", description = "Requires ADMIN role.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<VehicleResponse> updateVehicle(@PathVariable UUID id, @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.updateVehicle(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a vehicle", description = "Requires ADMIN role.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<Void> deleteVehicle(@PathVariable UUID id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}