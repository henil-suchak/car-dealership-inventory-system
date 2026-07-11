package com.dealership.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

public class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        // This will fail to compile because JwtService doesn't exist yet
        jwtService = new JwtService();
    }

    @Test
    void shouldGenerateTokenForUser() {
        UserDetails user = new User("testuser", "password", Collections.emptyList());

        String token = jwtService.generateToken(user);

        assertThat(token).isNotNull();
        assertThat(jwtService.extractUsername(token)).isEqualTo("testuser");
    }
}