package com.openclassrooms.starterjwt.exceptiontest;

import com.openclassrooms.starterjwt.exception.NotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import static org.junit.jupiter.api.Assertions.*;

class NotFoundExceptionTest {

    @Test
    void testNotFoundExceptionIsThrown() {
        // Vérifie que l'exception peut être levée
        assertThrows(NotFoundException.class, () -> {
            throw new NotFoundException();
        });
    }

    @Test
    void testResponseStatusAnnotation() {
        // Vérifie que l'annotation @ResponseStatus est correctement configurée
        ResponseStatus responseStatus = NotFoundException.class.getAnnotation(ResponseStatus.class);
        assertNotNull(responseStatus, "L'annotation @ResponseStatus est absente.");
        assertEquals(HttpStatus.NOT_FOUND, responseStatus.value(), "Le code HTTP n'est pas NOT_FOUND.");
    }
}