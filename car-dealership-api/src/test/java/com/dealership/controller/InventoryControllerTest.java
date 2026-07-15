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
import com.dealership.service.JwtService;
import com.dealership.entity.User;
import com.dealership.entity.Role;
import com.dealership.repository.UserRepository;
import com.dealership.repository.PurchaseRepository;
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

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PurchaseRepository purchaseRepository;

    private UUID availableVehicleId;
    private UUID outOfStockVehicleId;

    @BeforeEach
    void setUp() {
        purchaseRepository.deleteAll();
        vehicleRepository.deleteAll();

        Vehicle available = new Vehicle("Toyota", "Camry", "SEDAN", new BigDecimal("25000.00"), 5);
        availableVehicleId = vehicleRepository.save(available).getId();

        Vehicle outOfStock = new Vehicle("Honda", "Civic", "SEDAN", new BigDecimal("22000.00"), 0);
        outOfStockVehicleId = vehicleRepository.save(outOfStock).getId();

        userRepository.deleteAll();
        User testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("testuser@example.com");
        testUser.setPassword("password");
        testUser.setRole(Role.USER);
        userRepository.save(testUser);
        
        User adminUser = new User();
        adminUser.setUsername("adminuser");
        adminUser.setEmail("adminuser@example.com");
        adminUser.setPassword("password");
        adminUser.setRole(Role.ADMIN);
        userRepository.save(adminUser);
    }

    private String getToken(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return "Bearer " + jwtService.generateToken(user);
    }

    @Test
    void shouldPurchaseVehicleSuccessfully() throws Exception {
        mockMvc.perform(post("/api/vehicles/{id}/purchase", availableVehicleId)
                .header("Authorization", getToken("testuser@example.com")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantityInStock").value(4));
    }

    @Test
    void shouldFailPurchaseWhenOutOfStock() throws Exception {
        mockMvc.perform(post("/api/vehicles/{id}/purchase", outOfStockVehicleId)
                .header("Authorization", getToken("testuser@example.com")))
                .andExpect(status().isBadRequest()); // Or 422/409 depending on preference
    }

    @Test
    void shouldRestockVehicleWhenAdmin() throws Exception {
        String json = "{\"quantity\": 5}";
        mockMvc.perform(post("/api/vehicles/{id}/restock", availableVehicleId)
                .header("Authorization", getToken("adminuser@example.com"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantityInStock").value(10));
    }

    @Test
    void shouldReturn403WhenUserTriesToRestock() throws Exception {
        String json = "{\"quantity\": 5}";
        mockMvc.perform(post("/api/vehicles/{id}/restock", availableVehicleId)
                .header("Authorization", getToken("testuser@example.com"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldFailRestockWithNegativeAmount() throws Exception {
        String json = "{\"quantity\": -2}";
        mockMvc.perform(post("/api/vehicles/{id}/restock", availableVehicleId)
                .header("Authorization", getToken("adminuser@example.com"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }
}
