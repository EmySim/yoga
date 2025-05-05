package com.openclassrooms.starterjwt.config;

import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.frameoptions.XFrameOptionsHeaderWriter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Profile("test")
@TestConfiguration
public class TestSecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(TestSecurityConfig.class);

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        logger.info("🔒 Chargement de la configuration de sécurité pour les tests...");

        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers(new AntPathRequestMatcher("/api/auth/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex.authenticationEntryPoint((req, res, excep) -> {
                    logger.info("⛔ Requête non autorisée interceptée, retour du statut 401");
                    res.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
                }))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers.addHeaderWriter(
                        new XFrameOptionsHeaderWriter(XFrameOptionsHeaderWriter.XFrameOptionsMode.SAMEORIGIN)
                ))
                .httpBasic(httpBasic -> httpBasic.disable()) // Désactivation explicite de HTTP Basic
                .formLogin(form -> form.disable());          // Compatible 6.1 : désactive form login sans dépréciation

        return http.build();
    }


}
