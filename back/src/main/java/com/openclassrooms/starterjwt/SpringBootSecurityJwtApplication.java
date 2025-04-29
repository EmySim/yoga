package com.openclassrooms.starterjwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class SpringBootSecurityJwtApplication implements CommandLineRunner {

	@Value("${spring.profiles.active:default}")
	private String activeProfile;

	public static void main(String[] args) {
		SpringApplication.run(SpringBootSecurityJwtApplication.class, args);
	}

	@Override
	public void run(String... args) {
		System.out.println("\n\n🔧 [INFO] Profil Spring actif : " + activeProfile.toUpperCase() + "\n");
	}
}
