package com.dealership.finance.dto;

import java.math.BigDecimal;

public class FinanceResponse {
    private BigDecimal principalAmount;
    private BigDecimal monthlyPayment;
    private BigDecimal totalInterestPaid;
    private BigDecimal totalCostToBuyer;

    public FinanceResponse(BigDecimal principalAmount, BigDecimal monthlyPayment, BigDecimal totalInterestPaid, BigDecimal totalCostToBuyer) {
        this.principalAmount = principalAmount;
        this.monthlyPayment = monthlyPayment;
        this.totalInterestPaid = totalInterestPaid;
        this.totalCostToBuyer = totalCostToBuyer;
    }

    public BigDecimal getPrincipalAmount() { return principalAmount; }
    public void setPrincipalAmount(BigDecimal principalAmount) { this.principalAmount = principalAmount; }

    public BigDecimal getMonthlyPayment() { return monthlyPayment; }
    public void setMonthlyPayment(BigDecimal monthlyPayment) { this.monthlyPayment = monthlyPayment; }

    public BigDecimal getTotalInterestPaid() { return totalInterestPaid; }
    public void setTotalInterestPaid(BigDecimal totalInterestPaid) { this.totalInterestPaid = totalInterestPaid; }

    public BigDecimal getTotalCostToBuyer() { return totalCostToBuyer; }
    public void setTotalCostToBuyer(BigDecimal totalCostToBuyer) { this.totalCostToBuyer = totalCostToBuyer; }
}
