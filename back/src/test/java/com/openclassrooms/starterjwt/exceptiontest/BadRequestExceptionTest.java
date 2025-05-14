package com.openclassrooms.starterjwt.exceptiontest;


import com.openclassrooms.starterjwt.exception.BadRequestException;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


import static org.junit.jupiter.api.Assertions.*;
@Tag("unit")
class BadRequestExceptionTest {

    @Test
    void testBadRequestExceptionIsThrown() {
        // Vérifie que l'exception peut être levée
        assertThrows(BadRequestException.class, () -> {
            throw new BadRequestException();
        });
    }

    @Test
    void testResponseStatusAnnotation() {
        // Vérifie que l'annotation @ResponseStatus est correctement configurée
        ResponseStatus responseStatus = BadRequestException.class.getAnnotation(ResponseStatus.class);
        assertNotNull(responseStatus, "L'annotation @ResponseStatus est absente.");
        assertEquals(HttpStatus.BAD_REQUEST, responseStatus.value(), "Le code HTTP n'est pas BAD_REQUEST.");
    }
}