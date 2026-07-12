package com.dealership.service;

import com.dealership.finance.dto.FinanceRequest;
import com.dealership.finance.dto.FinanceResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class FinanceService {

    public FinanceResponse calculateDeal(FinanceRequest request) {
        BigDecimal principal = request.getVehiclePrice()
                .subtract(request.getDownPayment())
                .subtract(request.getTradeInValue() != null ? request.getTradeInValue() : BigDecimal.ZERO);

        if (principal.compareTo(BigDecimal.ZERO) <= 0) {
            return new FinanceResponse(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, request.getVehiclePrice());
        }

        BigDecimal monthlyPayment;
        BigDecimal totalInterest;
        
        if (request.getInterestRate().compareTo(BigDecimal.ZERO) == 0) {
            monthlyPayment = principal.divide(BigDecimal.valueOf(request.getTermMonths()), 2, RoundingMode.HALF_UP);
            totalInterest = BigDecimal.ZERO;
        } else {
            // M = P [ i(1 + i)^n ] / [ (1 + i)^n - 1]
            BigDecimal monthlyInterestRate = request.getInterestRate().divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP)
                                                    .divide(BigDecimal.valueOf(12), 10, RoundingMode.HALF_UP);
            BigDecimal numMonths = BigDecimal.valueOf(request.getTermMonths());
            
            BigDecimal onePlusIRateToN = BigDecimal.ONE.add(monthlyInterestRate).pow(numMonths.intValue());
            
            BigDecimal numerator = monthlyInterestRate.multiply(onePlusIRateToN);
            BigDecimal denominator = onePlusIRateToN.subtract(BigDecimal.ONE);
            
            monthlyPayment = principal.multiply(numerator).divide(denominator, 2, RoundingMode.HALF_UP);
            
            BigDecimal totalRepayment = monthlyPayment.multiply(numMonths);
            totalInterest = totalRepayment.subtract(principal).setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal totalCostToBuyer = principal.add(totalInterest).add(request.getDownPayment())
                                       .add(request.getTradeInValue() != null ? request.getTradeInValue() : BigDecimal.ZERO);

        return new FinanceResponse(principal.setScale(2, RoundingMode.HALF_UP), 
                                   monthlyPayment, 
                                   totalInterest, 
                                   totalCostToBuyer.setScale(2, RoundingMode.HALF_UP));
    }
}
