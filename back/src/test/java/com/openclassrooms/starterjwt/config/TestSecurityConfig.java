package com.openclassrooms.starterjwt.config;

import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@TestConfiguration
public class TestSecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(TestSecurityConfig.class);

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        logger.info("🔒 Chargement de la configuration de sécurité pour les tests...");
        http
                .csrf(csrf -> {
                    logger.info("❌ Désactivation de CSRF pour les tests");
                    csrf.disable();
                })
                .authorizeHttpRequests(auth -> {
                    logger.info("✅ Autorisation des requêtes sur /api/auth/**, protection du reste");
                    auth
                            .requestMatchers("/api/auth/**").permitAll()
                            .anyRequest().authenticated();
                })
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    logger.info("⛔ Requête non autorisée interceptée, retour du statut 401 UNAUTHORIZED");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                }))
                .sessionManagement(session -> {
                    logger.info("🛑 Politique de session : STATELESS");
                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
                });
        return http.build();
    }
}
