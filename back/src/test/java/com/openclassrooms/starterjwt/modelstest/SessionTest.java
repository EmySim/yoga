package com.openclassrooms.starterjwt.modelstest;

import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Arrays;
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
                .name("Workshop")
                .date(new Date())  // Date actuelle
                .description("A workshop about yoga")
                .teacher(teacher)
                .users(Collections.singletonList(user))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Vérification que la session est bien créée et ses attributs sont corrects
        assertNotNull(session);
        assertEquals("Workshop", session.getName());
        assertEquals(1L, session.getId());
        assertEquals("A workshop about yoga", session.getDescription());
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
                .name("Workshop")
                .date(new Date())
                .description("A workshop about yoga")
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
                .description("A workshop about yoga")
                .teacher(teacher)
                .users(Collections.singletonList(user))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Vérification que la session a un nom vide (mais la validation devrait échouer si une validation de contraintes est appliquée)
        assertEquals("", session.getName());
    }

    @Test
    public void testSessionBuilder() {
        // Création d'une session avec un builder
        Session session = Session.builder()
                .id(1L)
                .name("Workshop")
                .date(new Date())
                .description("A workshop about yoga")
                .teacher(teacher)
                .users(Collections.singletonList(user))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Vérification que les propriétés sont correctement assignées
        assertEquals(1L, session.getId());
        assertEquals("Workshop", session.getName());
        assertNotNull(session.getDate());
        assertEquals("A workshop about yoga", session.getDescription());
        assertNotNull(session.getTeacher());
        assertEquals(1, session.getUsers().size());
    }

    @Test
    public void testToString() {
        Session session = Session.builder()
                .id(1L)
                .name("Workshop")
                .date(new Date())
                .description("A workshop about yoga")
                .teacher(teacher)
                .users(Collections.singletonList(user))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Vérifier que la méthode toString contient certaines valeurs attendues
        assertTrue(session.toString().contains("Workshop"));
        assertTrue(session.toString().contains("A workshop about yoga"));
    }

    @Test
    public void testEqualsAndHashCode() {
        Session session1 = Session.builder()
                .id(1L)
                .name("Workshop")
                .date(new Date())
                .description("A workshop about yoga")
                .teacher(teacher)
                .users(Collections.singletonList(user))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Session session2 = Session.builder()
                .id(1L)
                .name("Workshop")
                .date(new Date())
                .description("A workshop about yoga")
                .teacher(teacher)
                .users(Collections.singletonList(user))
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Vérifier que les deux objets sont égaux
        assertEquals(session1, session2);
        // Vérifier que leurs hashcodes sont identiques
        assertEquals(session1.hashCode(), session2.hashCode());
    }

    @Test
    public void testSessionWithMultipleUsers() {
        // Ajout d'un autre utilisateur
        User user2 = User.builder()
                .id(2L)
                .email("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .password("password")
                .admin(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Création d'une session avec deux utilisateurs
        Session session = Session.builder()
                .id(1L)
                .name("Workshop")
                .date(new Date())
                .description("A workshop about yoga")
                .teacher(teacher)
                .users(Arrays.asList(user, user2))  // Liste avec deux utilisateurs
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Vérification que la session contient deux utilisateurs
        assertEquals(2, session.getUsers().size());
    }

    @Test
    public void testSessionWithDefaultValues() {
        // Création d'une session sans valeurs spécifiques pour les dates
        Session session = Session.builder()
                .id(1L)
                .name("Workshop")
                .date(new Date())
                .description("A workshop about yoga")
                .teacher(teacher)
                .users(Collections.singletonList(user))
                .createdAt(LocalDateTime.now())  // Initialisation manuelle de createdAt
                .updatedAt(LocalDateTime.now())  // Initialisation manuelle de updatedAt
                .build();

        // Vérification que les dates sont bien initialisées
        assertNotNull(session.getCreatedAt());
        assertNotNull(session.getUpdatedAt());
    }

}
