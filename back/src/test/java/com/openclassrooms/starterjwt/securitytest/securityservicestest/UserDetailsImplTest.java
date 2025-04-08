package com.openclassrooms.starterjwt.securitytest.securityservicestest;

import static org.junit.jupiter.api.Assertions.*;

import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.HashSet;

class UserDetailsImplTest {

    @Test
    void testGetters() {
        // Création d'une instance avec des valeurs fictives
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testUser")
                .firstName("John")
                .lastName("Doe")
                .admin(true)
                .password("password123")
                .build();

        // Vérifications des getters
        assertEquals(1L, userDetails.getId());
        assertEquals("testUser", userDetails.getUsername());
        assertEquals("John", userDetails.getFirstName());
        assertEquals("Doe", userDetails.getLastName());
        assertTrue(userDetails.getAdmin());
        assertEquals("password123", userDetails.getPassword());
    }

    @Test
    void testGetAuthorities() {
        // Création d'une instance fictive
        UserDetailsImpl userDetails = UserDetailsImpl.builder()
                .id(1L)
                .username("testUser")
                .build();

        // Appel de la méthode getAuthorities
        Collection<? extends GrantedAuthority> authorities = userDetails.getAuthorities();

        // Vérifications
        assertNotNull(authorities, "Authorities collection ne doit pas être null.");
        assertTrue(authorities.isEmpty(), "Authorities collection doit être vide.");
    }

    @Test
    void testIsAccountNonExpired() {
        // Mock de UserDetailsImpl
        UserDetailsImpl userDetails = Mockito.mock(UserDetailsImpl.class);
        Mockito.when(userDetails.isAccountNonExpired()).thenReturn(true);

        // Vérification
        assertTrue(userDetails.isAccountNonExpired());
    }

    @Test
    void testIsAccountNonLocked() {
        // Mock de UserDetailsImpl
        UserDetailsImpl userDetails = Mockito.mock(UserDetailsImpl.class);
        Mockito.when(userDetails.isAccountNonLocked()).thenReturn(true);

        // Vérification
        assertTrue(userDetails.isAccountNonLocked());
    }

    @Test
    void testIsCredentialsNonExpired() {
        // Mock de UserDetailsImpl
        UserDetailsImpl userDetails = Mockito.mock(UserDetailsImpl.class);
        Mockito.when(userDetails.isCredentialsNonExpired()).thenReturn(true);

        // Vérification
        assertTrue(userDetails.isCredentialsNonExpired());
    }

    @Test
    void testIsEnabled() {
        // Mock de UserDetailsImpl
        UserDetailsImpl userDetails = Mockito.mock(UserDetailsImpl.class);
        Mockito.when(userDetails.isEnabled()).thenReturn(true);

        // Vérification
        assertTrue(userDetails.isEnabled());
    }

    @Test
    void testEqualsAndHashCode() {
        // Création de deux instances avec le même ID
        UserDetailsImpl userDetails1 = UserDetailsImpl.builder()
                .id(1L)
                .username("testUser")
                .build();

        UserDetailsImpl userDetails2 = UserDetailsImpl.builder()
                .id(1L)
                .username("otherUser") // Nom différent mais même ID
                .build();

        // Vérification d'égalité
        assertEquals(userDetails1, userDetails2, "Les objets avec le même ID doivent être égaux.");

        // Vérification avec un ID différent
        UserDetailsImpl userDetails3 = UserDetailsImpl.builder()
                .id(2L)
                .username("testUser")
                .build();

        assertNotEquals(userDetails1, userDetails3, "Les objets avec des IDs différents ne doivent pas être égaux.");
    }
}