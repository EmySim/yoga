package com.openclassrooms.starterjwt.payloadtest.responsetest;

import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MessageResponseTest {

    @Test
    void testConstructorAndGetter() {
        // Création d'une instance avec le constructeur
        MessageResponse messageResponse = new MessageResponse("Test message");

        // Vérification que le message est correctement assigné
        assertEquals("Test message", messageResponse.getMessage());
    }

    @Test
    void testSetter() {
        MessageResponse messageResponse = new MessageResponse("Initial message");

        // Modification du message via le setter
        messageResponse.setMessage("Updated message");

        // Vérification que le message a bien été mis à jour
        assertEquals("Updated message", messageResponse.getMessage());
    }
}

