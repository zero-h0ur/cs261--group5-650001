package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.example")
@EnableJpaRepositories("com.example.tuevents.repo")
@EntityScan("com.example.tuevents.model")
public class DemoTuEventsApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoTuEventsApplication.class, args);
	}

}
