package com.dealership.finance.controller;

import com.dealership.finance.dto.FinanceRequest;
import com.dealership.finance.dto.FinanceResponse;
import com.dealership.finance.service.FinanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/finance")
@Tag(name = "Finance", description = "Endpoints for Deal Calculation")
public class FinanceController {

    private final FinanceService financeService;

    public FinanceController(FinanceService financeService) {
        this.financeService = financeService;
    }

    @PostMapping("/calculate")
    @Operation(summary = "Calculate loan amortizations", description = "Calculates monthly payment and total interest based on structured deal parameters. No auth required.")
    public ResponseEntity<FinanceResponse> calculateDeal(@Valid @RequestBody FinanceRequest request) {
        return ResponseEntity.ok(financeService.calculateDeal(request));
    }
}
