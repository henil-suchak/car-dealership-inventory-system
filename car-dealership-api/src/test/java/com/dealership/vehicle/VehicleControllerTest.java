package com.dealership.vehicle;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturn401WhenCreatingVehicleWithoutAuth() throws Exception {
        String json = "{\"make\":\"Toyota\", \"model\":\"Camry\", \"category\":\"SEDAN\", \"price\":25000, \"quantityInStock\":10}";
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void shouldCreateVehicleWhenAdmin() throws Exception {
        String json = "{\"make\":\"Toyota\", \"model\":\"Camry\", \"category\":\"SEDAN\", \"price\":25000, \"quantityInStock\":10}";
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated());
    }

    @Test
    @WithMockUser(roles = "USER")
    void shouldReturn403WhenUserTriesToCreateVehicle() throws Exception {
        String json = "{\"make\":\"Toyota\", \"model\":\"Camry\", \"category\":\"SEDAN\", \"price\":25000, \"quantityInStock\":10}";
        mockMvc.perform(post("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isForbidden());
    }

    @Test
    void shouldReturnVehiclesPaginated() throws Exception {
        mockMvc.perform(get("/api/vehicles")
                        .param("page", "0")
                        .param("size", "20"))
                .andExpect(status().isOk());
    }
}