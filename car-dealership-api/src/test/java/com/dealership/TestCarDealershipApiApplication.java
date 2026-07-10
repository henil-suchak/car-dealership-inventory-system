package com.dealership;

import org.springframework.boot.SpringApplication;

public class TestCarDealershipApiApplication {

	public static void main(String[] args) {
		SpringApplication.from(CarDealershipApiApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
