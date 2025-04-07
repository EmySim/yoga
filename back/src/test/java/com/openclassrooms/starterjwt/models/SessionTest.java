package com.openclassrooms.starterjwt.models;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

public class SessionTest {

    private Teacher teacher;
    private User user;

    @BeforeEach
    public void setUp() {
        // Initialisation d'un professeur et d'un utilisateur pour les tests
        teacher = Teacher.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        user = User.builder()
                .id(1L)
                .email("jane.doe@example.com")
                .firstName("Jane")
                .lastName("Doe")
                .password("password")
                .admin(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    public void testSessionCreation() {
        // Création d'une session
        Session session = Session.builder()
                .id(1L)
                .name("Spring Boot Workshop")
                .date(new Date())  // Date actuelle
                .description("A workshop about Spring Boot")
                .teacher(teacher)
                .users(Collections.singletonList(user))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Vérification que la session est bien créée et ses attributs sont corrects
        assertNotNull(session);
        assertEquals("Spring Boot Workshop", session.getName());
        assertEquals(1L, session.getId());
        assertEquals("A workshop about Spring Boot", session.getDescription());
        assertNotNull(session.getTeacher());
        assertEquals("John", session.getTeacher().getFirstName());
        assertEquals(1, session.getUsers().size());
        assertEquals("jane.doe@example.com", session.getUsers().get(0).getEmail());
    }

    @Test
    public void testSessionWithNullTeacher() {
        // Création d'une session sans professeur
        Session session = Session.builder()
                .id(1L)
                .name("Spring Boot Workshop")
                .date(new Date())
                .description("A workshop about Spring Boot")
                .teacher(null)  // Aucun professeur
                .users(Collections.singletonList(user))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Vérification que la session est toujours valide même sans professeur
        assertNotNull(session);
        assertNull(session.getTeacher());
        assertEquals(1, session.getUsers().size());
    }

    @Test
    public void testSessionWithEmptyName() {
        // Création d'une session avec un nom vide (violant la contrainte @NotBlank)
        Session session = Session.builder()
                .id(1L)
                .name("")  // Nom vide
                .date(new Date())
                .description("A workshop about Spring Boot")
                .teacher(teacher)
                .users(Collections.singletonList(user))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Vérification que la session a un nom vide (mais la validation devrait échouer si une validation de contraintes est appliquée)
        assertEquals("", session.getName());
    }
}
