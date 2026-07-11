package com.dealership.controller;

import com.dealership.service.InventoryService;
import com.dealership.vehicle.dto.RestockRequest;
import com.dealership.vehicle.dto.VehicleResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/{id}/purchase")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<VehicleResponse> purchaseVehicle(@PathVariable UUID id) {
        return ResponseEntity.ok(inventoryService.purchaseVehicle(id));
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VehicleResponse> restockVehicle(
            @PathVariable UUID id,
            @Valid @RequestBody RestockRequest request) {
        return ResponseEntity.ok(inventoryService.restockVehicle(id, request.quantity()));
    }
}
