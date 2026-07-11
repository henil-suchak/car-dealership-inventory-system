package com.dealership.vehicle;

import com.dealership.TestcontainersConfiguration; // Correct import
import com.dealership.entity.Vehicle;
import com.dealership.repository.VehicleRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.testcontainers.junit.jupiter.Testcontainers; // Required

import java.math.BigDecimal;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Testcontainers // Required to enable container lifecycle management
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Import(TestcontainersConfiguration.class)
public class VehicleRepositoryTest {

    @Autowired
    private VehicleRepository vehicleRepository;

    @Test
    void shouldSaveAndFindVehicle() {
        // Arrange
        Vehicle vehicle = new Vehicle(null, "Toyota", "Camry", "SEDAN", new BigDecimal("25000.00"), 10, null);

        // Action
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        // Assertion
        assertThat(savedVehicle.getId()).isNotNull();
        assertThat(vehicleRepository.findById(savedVehicle.getId())).isPresent();
    }
}