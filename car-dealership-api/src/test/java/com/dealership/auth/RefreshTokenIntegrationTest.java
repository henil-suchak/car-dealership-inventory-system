package com.dealership.auth;

import com.dealership.entity.Role;
import com.dealership.entity.User;
import com.dealership.repository.UserRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@org.springframework.context.annotation.Import(com.dealership.TestcontainersConfiguration.class)
public class RefreshTokenIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void shouldReturnTokensOnLoginAndRefreshSuccessfully() throws Exception {
        // 1. Create a user
        User user = new User();
        user.setUsername("refreshuser");
        user.setEmail("refresh@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(Role.CUSTOMER);
        userRepository.save(user);

        // 2. Login to get access token and refresh token
        String loginJson = "{\"email\":\"refresh@example.com\", \"password\":\"password123\"}";
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.refreshToken").exists()) // This will fail initially (RED)
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        JsonNode jsonNode = objectMapper.readTree(responseBody);
        String refreshToken = jsonNode.get("refreshToken").asText();

        // 3. Use the refresh token to get a new access token
        String refreshJson = "{\"refreshToken\":\"" + refreshToken + "\"}";
        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refreshJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.refreshToken").exists());
    }

    @Test
    void shouldRejectInvalidRefreshToken() throws Exception {
        String refreshJson = "{\"refreshToken\":\"invalid-or-fake-token\"}";
        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refreshJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void shouldRevokeRefreshTokenOnLogout() throws Exception {
        // 1. Create a user
        User user = new User();
        user.setUsername("logoutuser");
        user.setEmail("logout@example.com");
        user.setPassword(passwordEncoder.encode("password123"));
        user.setRole(Role.CUSTOMER);
        userRepository.save(user);

        // 2. Login to get access token and refresh token
        String loginJson = "{\"email\":\"logout@example.com\", \"password\":\"password123\"}";
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(loginJson))
                .andExpect(status().isOk())
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        JsonNode jsonNode = objectMapper.readTree(responseBody);
        String accessToken = jsonNode.get("token").asText();
        String refreshToken = jsonNode.get("refreshToken").asText();

        // 3. Logout (which should revoke the token)
        mockMvc.perform(post("/api/auth/logout")
                        .header("Authorization", "Bearer " + accessToken))
                .andExpect(status().isOk()); // Assuming it returns 200 OK or 204 No Content

        // 4. Try to use the revoked refresh token
        String refreshJson = "{\"refreshToken\":\"" + refreshToken + "\"}";
        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(refreshJson))
                .andExpect(status().isUnauthorized()); // Should be unauthorized because token is deleted
    }
}
