package com.dealership.service;

import com.dealership.TestcontainersConfiguration;
import com.dealership.entity.Vehicle;
import com.dealership.entity.User;
import com.dealership.entity.Role;
import com.dealership.repository.VehicleRepository;
import com.dealership.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicInteger;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Testcontainers
@Import(TestcontainersConfiguration.class)
public class InventoryConcurrencyTest {

    @Autowired
    private InventoryService inventoryService; // We will build this in GREEN phase

    @Autowired
    private VehicleRepository vehicleRepository;

    @Autowired
    private UserRepository userRepository;

    @Test
    void shouldPreventOversellingInConcurrentPurchases() throws InterruptedException {
        // Arrange: Create a vehicle with exactly 1 in stock
        Vehicle vehicle = new Vehicle("Ford", "Mustang", "COUPE", new BigDecimal("35000.00"), 1);
        vehicle = vehicleRepository.save(vehicle);
        final java.util.UUID vehicleId = vehicle.getId();

        User testUser = new User();
        testUser.setUsername("testbuyer");
        testUser.setEmail("buyer@example.com");
        testUser.setPassword("password");
        testUser.setRole(Role.USER);
        final User savedUser = userRepository.save(testUser);

        // Simulate 5 users trying to buy the same 1 car at the exact same millisecond
        int numberOfThreads = 5;
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch startLatch = new CountDownLatch(1);
        CountDownLatch endLatch = new CountDownLatch(numberOfThreads);

        AtomicInteger successfulPurchases = new AtomicInteger(0);
        AtomicInteger failedPurchases = new AtomicInteger(0);

        // Act
        for (int i = 0; i < numberOfThreads; i++) {
            executorService.execute(() -> {
                try {
                    startLatch.await(); // Wait for all threads to be ready
                    inventoryService.purchaseVehicle(vehicleId, savedUser);
                    successfulPurchases.incrementAndGet();
                } catch (Exception e) {
                    failedPurchases.incrementAndGet(); // Expecting OptimisticLockingFailureException or out of stock
                } finally {
                    endLatch.countDown();
                }
            });
        }

        startLatch.countDown(); // Unleash the threads!
        endLatch.await(); // Wait for all to finish

        // Assert: Only ONE purchase should succeed, 4 should fail. Stock should be 0.
        assertThat(successfulPurchases.get()).isEqualTo(1);
        assertThat(failedPurchases.get()).isEqualTo(4);

        Vehicle updatedVehicle = vehicleRepository.findById(vehicleId).orElseThrow();
        assertThat(updatedVehicle.getQuantityInStock()).isEqualTo(0);
    }
}
