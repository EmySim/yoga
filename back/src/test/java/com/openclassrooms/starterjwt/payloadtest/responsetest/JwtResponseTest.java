package com.openclassrooms.starterjwt.payloadtest.responsetest;

import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class JwtResponseTest {

    @Test
    void testConstructor() {
        // Création d'une instance avec le constructeur
        JwtResponse response = new JwtResponse("access_token", 1L, "testuser", "Test", "User", true);

        // Vérification que les champs sont correctement assignés
        assertEquals("access_token", response.getToken());
        assertEquals(1L, response.getId());
        assertEquals("testuser", response.getUsername());
        assertEquals("Test", response.getFirstName());
        assertEquals("User", response.getLastName());
        assertTrue(response.getAdmin());
    }

    @Test
    void testSettersAndGetters() {
        JwtResponse response = new JwtResponse("access_token", 1L, "testuser", "Test", "User", true);

        // Modification des valeurs via les setters
        response.setToken("new_access_token");
        response.setId(2L);
        response.setUsername("newuser");
        response.setFirstName("New");
        response.setLastName("User");
        response.setAdmin(false);

        // Vérification que les setters ont bien modifié les valeurs
        assertEquals("new_access_token", response.getToken());
        assertEquals(2L, response.getId());
        assertEquals("newuser", response.getUsername());
        assertEquals("New", response.getFirstName());
        assertEquals("User", response.getLastName());
        assertFalse(response.getAdmin());
    }
}
