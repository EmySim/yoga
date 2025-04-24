package com.openclassrooms.starterjwt.config;

import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestRestTemplateConfig {

    @Bean
    public TestRestTemplate testRestTemplate() {
        TestRestTemplate restTemplate = new TestRestTemplate();
        // Supprime le gestionnaire d'erreurs personnalisé
        return restTemplate;
    }
}