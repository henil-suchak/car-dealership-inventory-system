package com.dealership.vehicle;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import java.math.BigDecimal;
import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class VehicleRepositoryTest {
    @Autowired
    private VehicleRepository vehicleRepository;

    @Test
    void shouldSaveAndFindVehicle(){
        //Arrange
        Vehicle vehicle = new Vehicle("Toyota", "Camry", "SEDAN", new BigDecimal("25000.00"), 10);

        //Action
        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        //Assertion
        assertThat(savedVehicle.getId()).isNotNull();
        assertThat(vehicleRepository.findById(savedVehicle.getId())).isPresent();
    }
}