package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class TeacherTest {

    @Test
    public void testTeacherCreation() {
        Teacher teacher = Teacher.builder()
                .firstName("John")
                .lastName("Doe")
                .build();

        assertNotNull(teacher);
        assertEquals("John", teacher.getFirstName());
        assertEquals("Doe", teacher.getLastName());
    }
}