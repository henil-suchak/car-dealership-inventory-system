package com.dealership.finance.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class FinanceRequest {
    @NotNull(message = "Vehicle price is required")
    @Min(value = 0, message = "Vehicle price cannot be negative")
    private BigDecimal vehiclePrice;

    @NotNull(message = "Down payment is required")
    @Min(value = 0, message = "Down payment cannot be negative")
    private BigDecimal downPayment;

    @Min(value = 0, message = "Trade in value cannot be negative")
    private BigDecimal tradeInValue = BigDecimal.ZERO;

    @NotNull(message = "Loan term in months is required")
    @Min(value = 12, message = "Loan term must be at least 12 months")
    private Integer termMonths;

    @NotNull(message = "Interest rate is required")
    @Min(value = 0, message = "Interest rate cannot be negative")
    private BigDecimal interestRate;

    // Getters and Setters
    public BigDecimal getVehiclePrice() { return vehiclePrice; }
    public void setVehiclePrice(BigDecimal vehiclePrice) { this.vehiclePrice = vehiclePrice; }

    public BigDecimal getDownPayment() { return downPayment; }
    public void setDownPayment(BigDecimal downPayment) { this.downPayment = downPayment; }

    public BigDecimal getTradeInValue() { return tradeInValue; }
    public void setTradeInValue(BigDecimal tradeInValue) { this.tradeInValue = tradeInValue; }

    public Integer getTermMonths() { return termMonths; }
    public void setTermMonths(Integer termMonths) { this.termMonths = termMonths; }

    public BigDecimal getInterestRate() { return interestRate; }
    public void setInterestRate(BigDecimal interestRate) { this.interestRate = interestRate; }
}
