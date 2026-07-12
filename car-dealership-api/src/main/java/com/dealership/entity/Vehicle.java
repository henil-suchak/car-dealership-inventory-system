package com.dealership.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;
import java.util.Objects;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "vehicles", indexes = {
    @Index(name = "idx_vehicle_make", columnList = "make"),
    @Index(name = "idx_vehicle_category", columnList = "category"),
    @Index(name = "idx_vehicle_price", columnList = "price")
})
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String make;
    private String model;
    private String category;
    private BigDecimal price;
    private Integer quantityInStock;

    // Detailed Tags
    private Integer year;
    private Integer mileage;

    @Column(unique = true)
    private String vin;

    @Column(name = "trim_level")
    private String trimLevel;

    @Column(name = "engine_type")
    private String engineType;

    private String transmission;
    private String color;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VehicleMedia> media = new ArrayList<>();

    @OneToOne(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private VehicleConditionReport conditionReport;

    @Version
    private Long version;

    public Vehicle() {
    }

    // Constructor with essential fields
    public Vehicle(String make, String model, String category, BigDecimal price, Integer quantityInStock) {
        this.make = make;
        this.model = model;
        this.category = category;
        this.price = price;
        this.quantityInStock = quantityInStock;
    }

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    
    public String getMake() { return make; }
    public void setMake(String make) { this.make = make; }
    
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    
    public Integer getQuantityInStock() { return quantityInStock; }
    public void setQuantityInStock(Integer quantityInStock) { this.quantityInStock = quantityInStock; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Integer getMileage() { return mileage; }
    public void setMileage(Integer mileage) { this.mileage = mileage; }

    public String getVin() { return vin; }
    public void setVin(String vin) { this.vin = vin; }

    public String getTrimLevel() { return trimLevel; }
    public void setTrimLevel(String trimLevel) { this.trimLevel = trimLevel; }

    public String getEngineType() { return engineType; }
    public void setEngineType(String engineType) { this.engineType = engineType; }

    public String getTransmission() { return transmission; }
    public void setTransmission(String transmission) { this.transmission = transmission; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }

    public List<VehicleMedia> getMedia() { return media; }
    public void setMedia(List<VehicleMedia> media) { this.media = media; }
    public void addMedia(VehicleMedia m) {
        media.add(m);
        m.setVehicle(this);
    }
    public void removeMedia(VehicleMedia m) {
        media.remove(m);
        m.setVehicle(null);
    }

    public VehicleConditionReport getConditionReport() { return conditionReport; }
    public void setConditionReport(VehicleConditionReport conditionReport) {
        this.conditionReport = conditionReport;
        if (conditionReport != null) {
            conditionReport.setVehicle(this);
        }
    }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Vehicle vehicle = (Vehicle) o;
        return Objects.equals(id, vehicle.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}