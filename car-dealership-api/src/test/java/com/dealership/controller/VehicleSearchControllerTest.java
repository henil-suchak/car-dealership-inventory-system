package com.dealership.controller;

import com.dealership.TestcontainersConfiguration;
import com.dealership.entity.Vehicle;
import com.dealership.repository.VehicleRepository;
import com.dealership.repository.PurchaseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@Import(TestcontainersConfiguration.class)
public class VehicleSearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private PurchaseRepository purchaseRepository;

    @BeforeEach
    void setUp() {
        purchaseRepository.deleteAll();
        vehicleRepository.deleteAll();
        
        List<Vehicle> vehicles = List.of(
            new Vehicle("Toyota", "Camry", "SEDAN", new BigDecimal("25000.00"), 10),
            new Vehicle("Toyota", "RAV4", "SUV", new BigDecimal("30000.00"), 5),
            new Vehicle("Honda", "Civic", "SEDAN", new BigDecimal("22000.00"), 8),
            new Vehicle("Ford", "F-150", "TRUCK", new BigDecimal("45000.00"), 3)
        );
        vehicleRepository.saveAll(vehicles);
    }

    @Test
    void shouldSearchByExactMake() throws Exception {
        mockMvc.perform(get("/api/vehicles/search")
                .param("make", "Toyota")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2))) 
                .andExpect(jsonPath("$.content[0].make").value("Toyota"));
    }

    @Test
    void shouldSearchByPriceRange() throws Exception {
        mockMvc.perform(get("/api/vehicles/search")
                .param("minPrice", "20000")
                .param("maxPrice", "28000")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(2))); 
    }

    @Test
    void shouldSearchWithCombinedFilters() throws Exception {
        mockMvc.perform(get("/api/vehicles/search")
                .param("make", "Toyota")
                .param("category", "SUV")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1))) 
                .andExpect(jsonPath("$.content[0].model").value("RAV4"));
    }

    @Test
    void shouldReturnAllWhenNoFiltersProvided() throws Exception {
        mockMvc.perform(get("/api/vehicles/search")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(4))); 
    }

    @Test
    void shouldReturn400WhenMinPriceGreaterThanMaxPrice() throws Exception {
        mockMvc.perform(get("/api/vehicles/search")
                .param("minPrice", "50000")
                .param("maxPrice", "20000")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()); 
    }
}
