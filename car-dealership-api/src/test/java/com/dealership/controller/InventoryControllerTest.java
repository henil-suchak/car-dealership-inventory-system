package com.dealership.controller;

import com.dealership.TestcontainersConfiguration;
import com.dealership.entity.Vehicle;
import com.dealership.repository.VehicleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers
@Import(TestcontainersConfiguration.class)
public class InventoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private VehicleRepository vehicleRepository;

    private UUID availableVehicleId;
    private UUID outOfStockVehicleId;

    @BeforeEach
    void setUp() {
        vehicleRepository.deleteAll();

        Vehicle available = new Vehicle("Toyota", "Camry", "SEDAN", new BigDecimal("25000.00"), 5);
        availableVehicleId = vehicleRepository.save(available).getId();

        Vehicle outOfStock = new Vehicle("Honda", "Civic", "SEDAN", new BigDecimal("22000.00"), 0);
        outOfStockVehicleId = vehicleRepository.save(outOfStock).getId();
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldPurchaseVehicleSuccessfully() throws Exception {
        mockMvc.perform(post("/api/vehicles/{id}/purchase", availableVehicleId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantityInStock").value(4));
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldFailPurchaseWhenOutOfStock() throws Exception {
        mockMvc.perform(post("/api/vehicles/{id}/purchase", outOfStockVehicleId))
                .andExpect(status().isBadRequest()); // Or 422/409 depending on preference
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldRestockVehicleWhenAdmin() throws Exception {
        String json = "{\"quantity\": 5}";
        mockMvc.perform(post("/api/vehicles/{id}/restock", availableVehicleId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantityInStock").value(10));
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturn403WhenUserTriesToRestock() throws Exception {
        String json = "{\"quantity\": 5}";
        mockMvc.perform(post("/api/vehicles/{id}/restock", availableVehicleId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldFailRestockWithNegativeAmount() throws Exception {
        String json = "{\"quantity\": -2}";
        mockMvc.perform(post("/api/vehicles/{id}/restock", availableVehicleId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }
}
