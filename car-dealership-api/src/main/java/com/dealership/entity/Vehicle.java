package com.dealership.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String make;
    private String model;
    private String category;
    private BigDecimal price;
    private Integer quantityInStock;

    @Version
    private Long version;

    public Vehicle(String make, String model, String category, BigDecimal price, Integer quantityInStock) {
        this.make = make;
        this.model = model;
        this.category = category;
        this.price = price;
        this.quantityInStock = quantityInStock;
    }
}