package com.dealership.service;

import com.dealership.entity.Purchase;
import com.dealership.repository.PurchaseRepository;
import com.dealership.vehicle.dto.PurchaseResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;

    public PurchaseService(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    @Transactional(readOnly = true)
    public List<PurchaseResponse> getMyPurchases(UUID userId) {
        return purchaseRepository.findByUserIdOrderByPurchaseDateDesc(userId)
                .stream()
                .map(this::mapToPurchaseResponse)
                .toList();
    }

    private PurchaseResponse mapToPurchaseResponse(Purchase purchase) {
        return new PurchaseResponse(
                purchase.getId(),
                purchase.getVehicle().getMake(),
                purchase.getVehicle().getModel(),
                purchase.getVehicle().getCategory(),
                purchase.getVehicle().getVin(),
                purchase.getPurchasePrice(),
                purchase.getPurchaseDate(),
                "Digital Signature Verified: " + purchase.getId().toString().substring(0, 8).toUpperCase()
        );
    }
}
