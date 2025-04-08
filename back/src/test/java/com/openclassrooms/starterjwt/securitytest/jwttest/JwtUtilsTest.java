package com.openclassrooms.starterjwt.securitytest.jwttest;

import static org.junit.jupiter.api.Assertions.*;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;

class JwtUtilsTest {

    private JwtUtils jwtUtils;

    private Authentication authentication;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();

        // Simuler l'authentification et les détails utilisateur
        authentication = Mockito.mock(Authentication.class);
        UserDetailsImpl userDetails = Mockito.mock(UserDetailsImpl.class);
        Mockito.when(authentication.getPrincipal()).thenReturn(userDetails);
        Mockito.when(userDetails.getUsername()).thenReturn("testUser");
    }

    @Test
    void testGenerateJwtToken() {
        String token = jwtUtils.generateJwtToken(authentication);
        assertNotNull(token, "Le token généré ne doit pas être null.");
        assertTrue(token.split("\\.").length == 3, "Le token doit contenir 3 parties séparées par des points.");
        System.out.println("Token généré : " + token);
    }

    @Test
    void testValidateJwtToken_InvalidToken() {
        String invalidToken = "invalid.jwt.token";

        boolean isValid = jwtUtils.validateJwtToken(invalidToken);
        assertFalse(isValid, "La validation doit échouer pour un token invalide.");
    }

    @Test
    void testValidateJwtToken_MalformedToken() {
        String malformedToken = "malformed.token"; // Un token mal formé

        boolean isValid = jwtUtils.validateJwtToken(malformedToken);
        assertFalse(isValid, "La validation doit échouer pour un token mal formé.");
    }

    @Test
    void testGetUserNameFromJwtToken_InvalidToken() {
        String invalidToken = "invalid.jwt.token";

        try {
            String username = jwtUtils.getUserNameFromJwtToken(invalidToken);
            fail("Une exception était attendue pour un token invalide.");
        } catch (Exception e) {
            assertTrue(e instanceof io.jsonwebtoken.JwtException, "L'exception doit être de type JwtException.");
            System.out.println("Exception capturée comme attendu : " + e.getMessage());
        }
    }
}