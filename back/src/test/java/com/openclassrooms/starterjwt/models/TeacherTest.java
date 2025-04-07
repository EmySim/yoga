package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.time.format.DateTimeFormatter;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

public class TeacherTest {

    private Validator validator;

    @BeforeEach
    public void setUp() {
        // Création du validateur pour tester les contraintes
        validator = Validation.buildDefaultValidatorFactory().getValidator();
    }

    @Test
    public void testTeacherBuilder() {
        // Test de la création d'un Teacher avec le builder
        Teacher teacher = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        assertNotNull(teacher);
        assertEquals("John", teacher.getFirstName());
        assertEquals("Doe", teacher.getLastName());
        assertNotNull(teacher.getCreatedAt());
        assertNotNull(teacher.getUpdatedAt());
    }

    @Test
    public void testTeacherWithValidFields() {
        Teacher teacher = new Teacher();
        teacher.setFirstName("Jane")
                .setLastName("Smith")
                .setCreatedAt(LocalDateTime.now())
                .setUpdatedAt(LocalDateTime.now());

        // Vérifier que les contraintes de validation ne lèvent pas d'erreur
        assertEquals(0, validator.validate(teacher).size(), "Teacher should be valid.");
    }

    @Test
    public void testTeacherWithInvalidFirstName() {
        Teacher teacher = new Teacher();
        teacher.setFirstName("")  // Vide, donc devrait violer @NotBlank
                .setLastName("Smith")
                .setCreatedAt(LocalDateTime.now())
                .setUpdatedAt(LocalDateTime.now());

        // Vérifier que la validation échoue pour le champ 'firstName'
        assertNotEquals(0, validator.validate(teacher).size(), "Teacher should be invalid due to empty first name.");
    }

    @Test
    public void testTeacherToString() {
        LocalDateTime now = LocalDateTime.now().truncatedTo(java.time.temporal.ChronoUnit.MINUTES);
        Teacher teacher = new Teacher(1L, "John", "Doe", now, now);

        // Formatage des dates pour les comparer à la minute près
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        String formattedCreatedAt = now.format(formatter);
        String formattedUpdatedAt = now.format(formatter);

        String expectedString = "Teacher(id=1, lastName=John, firstName=Doe, createdAt=" + formattedCreatedAt + ", updatedAt=" + formattedUpdatedAt + ")";

        // Comparer les objets
        assertEquals(expectedString, teacher.toString());
    }


    @Test
    public void testEqualsAndHashCode() {
        Teacher teacher1 = new Teacher(1L, "John", "Doe", LocalDateTime.now(), LocalDateTime.now());
        Teacher teacher2 = new Teacher(1L, "John", "Doe", LocalDateTime.now(), LocalDateTime.now());

        // Test de l'égalité et du hashcode
        assertEquals(teacher1, teacher2);
        assertEquals(teacher1.hashCode(), teacher2.hashCode());

        teacher2.setId(2L);
        assertNotEquals(teacher1, teacher2);
    }
}
