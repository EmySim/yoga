package com.openclassrooms.starterjwt.payloadtest.requesttest;

import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
@Tag("unit")
class LoginRequestTest {

    @Test
    void testGettersAndSetters() {
        // Crée une instance de LoginRequest
        LoginRequest loginRequest = new LoginRequest();

        // Définit des valeurs pour les champs
        String email = "test@example.com";
        String password = "password123";
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        // Vérifie que les valeurs définies sont correctement retournées par les getters
        assertEquals(email, loginRequest.getEmail(), "Le getter pour 'email' ne retourne pas la valeur attendue.");
        assertEquals(password, loginRequest.getPassword(), "Le getter pour 'password' ne retourne pas la valeur attendue.");
    }

    @Test
    void testDefaultConstructor() {
        // Vérifie que le constructeur par défaut initialise les champs à null
        LoginRequest loginRequest = new LoginRequest();
        assertNull(loginRequest.getEmail(), "Le champ 'email' devrait être null par défaut.");
        assertNull(loginRequest.getPassword(), "Le champ 'password' devrait être null par défaut.");
    }

    @Test
    void testSetEmailWithNullValue() {
        // Vérifie qu'un email null peut être défini
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(null);
        assertNull(loginRequest.getEmail(), "Le champ 'email' devrait accepter une valeur null.");
    }

    @Test
    void testSetPasswordWithNullValue() {
        // Vérifie qu'un mot de passe null peut être défini
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setPassword(null);
        assertNull(loginRequest.getPassword(), "Le champ 'password' devrait accepter une valeur null.");
    }
}