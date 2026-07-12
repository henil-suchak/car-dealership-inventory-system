package com.dealership.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Objects;

@Entity
@Table(name = "vehicle_condition_reports")
public class VehicleConditionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false, unique = true)
    @JsonIgnore
    private Vehicle vehicle;

    @Column(name = "scratches_description")
    private String scratchesDescription;

    @Column(name = "tire_tread_depth_mm")
    private Integer tireTreadDepthMm;

    @Column(name = "general_condition_score")
    private Integer generalConditionScore; // 1-10

    @Column(name = "report_date", nullable = false)
    private LocalDateTime reportDate;

    public VehicleConditionReport() {}

    public VehicleConditionReport(Vehicle vehicle, String scratchesDescription, Integer tireTreadDepthMm, Integer generalConditionScore) {
        this.vehicle = vehicle;
        this.scratchesDescription = scratchesDescription;
        this.tireTreadDepthMm = tireTreadDepthMm;
        this.generalConditionScore = generalConditionScore;
        this.reportDate = LocalDateTime.now();
    }

    // Getters and Setters

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public String getScratchesDescription() {
        return scratchesDescription;
    }

    public void setScratchesDescription(String scratchesDescription) {
        this.scratchesDescription = scratchesDescription;
    }

    public Integer getTireTreadDepthMm() {
        return tireTreadDepthMm;
    }

    public void setTireTreadDepthMm(Integer tireTreadDepthMm) {
        this.tireTreadDepthMm = tireTreadDepthMm;
    }

    public Integer getGeneralConditionScore() {
        return generalConditionScore;
    }

    public void setGeneralConditionScore(Integer generalConditionScore) {
        this.generalConditionScore = generalConditionScore;
    }

    public LocalDateTime getReportDate() {
        return reportDate;
    }

    public void setReportDate(LocalDateTime reportDate) {
        this.reportDate = reportDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        VehicleConditionReport that = (VehicleConditionReport) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
