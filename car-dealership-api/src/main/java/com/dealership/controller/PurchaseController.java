package com.dealership.controller;

import com.dealership.entity.User;
import com.dealership.service.PurchaseService;
import com.dealership.vehicle.dto.PurchaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
@Tag(name = "Purchases", description = "Endpoints for viewing purchase history")
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping("/my-purchases")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @Operation(summary = "Get my purchases", description = "Returns the purchase history for the authenticated user", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<List<PurchaseResponse>> getMyPurchases(@AuthenticationPrincipal User user) {
        List<PurchaseResponse> responses = purchaseService.getMyPurchases(user.getId());
        return ResponseEntity.ok(responses);
    }
}
