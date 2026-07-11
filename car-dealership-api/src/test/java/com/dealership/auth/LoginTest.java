package com.dealership.auth;

import com.dealership.TestcontainersConfiguration; // Make sure to import this!
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import; // Important
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.junit.jupiter.Testcontainers; // Important

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Testcontainers // Tell it to manage containers
@Import(TestcontainersConfiguration.class) // Tell it to use your custom config
public class LoginTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldReturn401WhenLoginWithWrongCredentials() throws Exception {
        String loginJson = "{\"email\":\"nonexistent@example.com\", \"password\":\"wrongpassword\"}";

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isUnauthorized());
    }
}