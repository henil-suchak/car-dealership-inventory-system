package com.dealership.vehicle;

import com.dealership.entity.Vehicle;
import com.dealership.repository.VehicleRepository;
import com.dealership.service.VehicleService;
import com.dealership.vehicle.dto.VehicleSearchCriteria;
import com.dealership.vehicle.dto.VehicleResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class VehicleSearchTest {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private VehicleRepository vehicleRepository;

    @BeforeEach
    public void setup() {
        vehicleRepository.deleteAll();
        
        Vehicle v1 = new Vehicle();
        v1.setMake("Toyota");
        v1.setModel("Camry");
        v1.setCategory("SEDAN");
        v1.setPrice(new BigDecimal("25000"));
        v1.setQuantityInStock(5);
        vehicleRepository.save(v1);

        Vehicle v2 = new Vehicle();
        v2.setMake("Lexus");
        v2.setModel("RX");
        v2.setCategory("SUV");
        v2.setPrice(new BigDecimal("55000"));
        v2.setQuantityInStock(2);
        vehicleRepository.save(v2);

        Vehicle v3 = new Vehicle();
        v3.setMake("Porsche");
        v3.setModel("911");
        v3.setCategory("COUPE");
        v3.setPrice(new BigDecimal("120000"));
        v3.setQuantityInStock(1);
        vehicleRepository.save(v3);
    }

    @Test
    public void testSearchByMinPrice() {
        VehicleSearchCriteria criteria = new VehicleSearchCriteria(null, null, null, new BigDecimal("50000"), null);
        Page<VehicleResponse> results = vehicleService.searchVehicles(criteria, PageRequest.of(0, 10));
        
        assertThat(results.getTotalElements()).isEqualTo(2);
        assertThat(results.getContent()).extracting("make").containsExactlyInAnyOrder("Lexus", "Porsche");
    }

    @Test
    public void testSearchByMaxPrice() {
        VehicleSearchCriteria criteria = new VehicleSearchCriteria(null, null, null, null, new BigDecimal("30000"));
        Page<VehicleResponse> results = vehicleService.searchVehicles(criteria, PageRequest.of(0, 10));
        
        assertThat(results.getTotalElements()).isEqualTo(1);
        assertThat(results.getContent().get(0).make()).isEqualTo("Toyota");
    }

    @Test
    public void testSearchByPriceRange() {
        VehicleSearchCriteria criteria = new VehicleSearchCriteria(null, null, null, new BigDecimal("30000"), new BigDecimal("100000"));
        Page<VehicleResponse> results = vehicleService.searchVehicles(criteria, PageRequest.of(0, 10));
        
        assertThat(results.getTotalElements()).isEqualTo(1);
        assertThat(results.getContent().get(0).make()).isEqualTo("Lexus");
    }

    @Test
    public void testInvalidPriceRange_ThrowsException() {
        VehicleSearchCriteria criteria = new VehicleSearchCriteria(null, null, null, new BigDecimal("100000"), new BigDecimal("50000"));
        assertThrows(IllegalArgumentException.class, () -> {
            vehicleService.searchVehicles(criteria, PageRequest.of(0, 10));
        });
    }
}
