package com.openclassrooms.starterjwt.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;

@Profile("test")
@TestConfiguration
public class TestRestTemplateConfig {

    @Bean
    public TestRestTemplate testRestTemplate() {
        // Template REST pour tests sans gestion d'erreurs personnalisée
        return new TestRestTemplate();
    }
}
