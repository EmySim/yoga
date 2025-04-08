package com.openclassrooms.starterjwt.payloadtest.responsetest.requesttest;

import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class SignupRequestTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        // Crée un validateur pour valider les annotations
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    void testValidSignupRequest() {
        // Créer une instance valide avec des valeurs valides
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("validemail@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("validPassword123");

        // Valider l'objet
        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        // Vérifier qu'il n'y a pas de violations de contraintes
        assertTrue(violations.isEmpty(), "Il ne devrait y avoir aucune violation de contrainte");
    }

    @Test
    void testInvalidEmail() {
        // Créer une instance invalide avec un email mal formé
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("invalidemail.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("validPassword123");

        // Valider l'objet
        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        // Vérifier qu'il y a une violation sur l'email
        assertFalse(violations.isEmpty(), "Il devrait y avoir des violations de contrainte");
        assertEquals(1, violations.size(), "Il devrait y avoir une violation");
        assertEquals("email", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void testBlankFirstName() {
        // Créer une instance invalide avec un prénom vide
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("validemail@example.com");
        signupRequest.setFirstName("");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("validPassword123");

        // Valider l'objet
        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        // Vérifier qu'il y a des violations de contrainte
        assertFalse(violations.isEmpty(), "Il devrait y avoir des violations de contrainte");
        assertEquals(2, violations.size(), "Il devrait y avoir deux violations");
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("firstName")),
                "Une violation devrait concerner le champ 'firstName'");
    }

    @Test
    void testFirstNameTooShort() {
        // Créer une instance invalide avec un prénom trop court
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("validemail@example.com");
        signupRequest.setFirstName("Jo");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("validPassword123");

        // Valider l'objet
        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        // Vérifier qu'il y a une violation sur le prénom (min 3 caractères)
        assertFalse(violations.isEmpty(), "Il devrait y avoir des violations de contrainte");
        assertEquals(1, violations.size(), "Il devrait y avoir une violation");
        assertEquals("firstName", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void testPasswordTooShort() {
        // Créer une instance invalide avec un mot de passe trop court
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("validemail@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("short");

        // Valider l'objet
        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        // Vérifier qu'il y a une violation sur le mot de passe (min 6 caractères)
        assertFalse(violations.isEmpty(), "Il devrait y avoir des violations de contrainte");
        assertEquals(1, violations.size(), "Il devrait y avoir une violation");
        assertEquals("password", violations.iterator().next().getPropertyPath().toString());
    }

    @Test
    void testInvalidLastName() {
        // Créer une instance invalide avec un nom de famille trop court
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("validemail@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("A");
        signupRequest.setPassword("validPassword123");

        // Valider l'objet
        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(signupRequest);

        // Vérifier qu'il y a une violation sur le nom de famille (min 3 caractères)
        assertFalse(violations.isEmpty(), "Il devrait y avoir des violations de contrainte");
        assertEquals(1, violations.size(), "Il devrait y avoir une violation");
        assertEquals("lastName", violations.iterator().next().getPropertyPath().toString());
    }
}

