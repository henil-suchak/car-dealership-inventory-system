package com.dealership.security;

import com.dealership.service.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@org.springframework.context.annotation.Import(com.dealership.TestcontainersConfiguration.class)
public class SecurityFunctionalTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JwtService jwtService;

    @Test
    void shouldReturnUnauthorizedWhenAccessingSecuredEndpointWithoutToken() throws Exception {
        // This hits the real SecurityFilterChain and should be rejected
        mockMvc.perform(get("/api/secured-dummy"))
                .andExpect(status().isUnauthorized());
    }

    @Autowired
    private com.dealership.repository.UserRepository userRepository;

    @Test
    void shouldReturnNotFoundWhenAccessingSecuredEndpointWithValidToken() throws Exception {
        // Save a real user in the test database so UserDetailsService can find it
        com.dealership.entity.User dbUser = new com.dealership.entity.User();
        dbUser.setUsername("testuser");
        dbUser.setEmail("test@example.com");
        dbUser.setPassword("password123");
        dbUser.setRole(com.dealership.entity.Role.CUSTOMER);
        userRepository.save(dbUser);

        // Create a token for this user
        UserDetails user = new User("test@example.com", "password", Collections.emptyList());
        String token = jwtService.generateToken(user);

        // Verify that with the token, we get past the security gate
        // Expecting 404 because the endpoint does not exist, but we successfully authenticated
        mockMvc.perform(get("/api/secured-dummy")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }
}