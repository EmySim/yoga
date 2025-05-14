package com.openclassrooms.starterjwt.securitytest.jwttest;

import com.openclassrooms.starterjwt.config.TestSecurityConfig;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
@Tag("unit")
@SpringBootTest
@Import(TestSecurityConfig.class)
class JwtUtilsTest {

    @Autowired
    private JwtUtils jwtUtils;

    private Authentication authentication;

    @BeforeEach
    void setUp() {
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
        assertEquals(3, token.split("\\.").length, "Le token doit contenir 3 parties séparées par des points.");
        System.out.println("✅ Token généré : " + token);
    }

    @Test
    void testValidateJwtToken_InvalidToken() {
        String invalidToken = "invalid.jwt.token";

        boolean isValid = jwtUtils.validateJwtToken(invalidToken);
        assertFalse(isValid, "La validation doit échouer pour un token invalide.");
    }

    @Test
    void testValidateJwtToken_MalformedToken() {
        String malformedToken = "malformed.token"; // Token incomplet ou tronqué

        boolean isValid = jwtUtils.validateJwtToken(malformedToken);
        assertFalse(isValid, "La validation doit échouer pour un token mal formé.");
    }

    @Test
    void testGetUserNameFromJwtToken_InvalidToken() {
        String invalidToken = "invalid.jwt.token";

        Exception exception = assertThrows(JwtException.class, () -> {
            jwtUtils.getUserNameFromJwtToken(invalidToken);
        });

        System.out.println("✅ Exception capturée comme attendu : " + exception.getMessage());
    }
}
