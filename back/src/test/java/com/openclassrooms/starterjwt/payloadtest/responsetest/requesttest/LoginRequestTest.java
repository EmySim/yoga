package com.openclassrooms.starterjwt.payloadtest.responsetest.requesttest;

import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        // Crée un validateur pour valider les annotations
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void testValidLoginRequest() {
        // Créer une instance valide avec un email et un mot de passe non vides
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");

        // Valider l'objet
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);

        // Vérifier qu'il n'y a pas de violations de contraintes
        assertTrue(violations.isEmpty(), "Il ne devrait y avoir aucune violation de contrainte");
    }

    @Test
    void testInvalidEmail() {
        // Créer une instance invalide avec un email vide
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("");
        loginRequest.setPassword("password123");

        // Valider l'objet
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);

        // Vérifier qu'il y a une violation sur l'email
        assertFalse(violations.isEmpty(), "Il devrait y avoir des violations de contrainte");
        assertEquals(1, violations.size(), "Il devrait y avoir une violation");
        assertEquals("email", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void testInvalidPassword() {
        // Créer une instance invalide avec un mot de passe vide
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("");

        // Valider l'objet
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);

        // Vérifier qu'il y a une violation sur le mot de passe
        assertFalse(violations.isEmpty(), "Il devrait y avoir des violations de contrainte");
        assertEquals(1, violations.size(), "Il devrait y avoir une violation");
        assertEquals("password", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void testInvalidLoginRequest() {
        // Créer une instance invalide avec les deux champs vides
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("");
        loginRequest.setPassword("");

        // Valider l'objet
        Set<ConstraintViolation<LoginRequest>> violations = validator.validate(loginRequest);

        // Vérifier qu'il y a des violations sur les deux champs
        assertFalse(violations.isEmpty(), "Il devrait y avoir des violations de contrainte");
        assertEquals(2, violations.size(), "Il devrait y avoir deux violations");
    }
}

