package com.dealership.controller;

import com.dealership.service.InventoryService;
import com.dealership.vehicle.dto.RestockRequest;
import com.dealership.vehicle.dto.VehicleResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
@Tag(name = "Inventory", description = "Endpoints for vehicle purchasing and restocking")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/{id}/purchase")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "Purchase a vehicle", description = "Decrements stock by 1. Requires USER or ADMIN role.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<VehicleResponse> purchaseVehicle(@PathVariable UUID id) {
        return ResponseEntity.ok(inventoryService.purchaseVehicle(id));
    }

    @PostMapping("/{id}/restock")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Restock a vehicle", description = "Increments stock. Requires ADMIN role.", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<VehicleResponse> restockVehicle(
            @PathVariable UUID id,
            @Valid @RequestBody RestockRequest request) {
        return ResponseEntity.ok(inventoryService.restockVehicle(id, request.quantity()));
    }
}
