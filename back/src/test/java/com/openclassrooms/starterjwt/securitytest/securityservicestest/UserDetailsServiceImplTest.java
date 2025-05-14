package com.openclassrooms.starterjwt.securitytest.securityservicestest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.Optional;

import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
@Tag("unit")
class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testLoadUserByUsername_UserExists() {
        // Given
        String email = "test@example.com";
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail(email);
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");
        mockUser.setPassword("password123");

        when(userRepository.findByEmail(email)).thenReturn(Optional.of(mockUser));

        // When
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Then
        assertNotNull(userDetails);
        assertEquals(email, userDetails.getUsername());
        assertEquals("password123", userDetails.getPassword());
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        assertTrue(userDetails.isEnabled());

        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void testLoadUserByUsername_UserNotFound() {
        // Given
        String email = "notfound@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When & Then
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(email),
                "Expected loadUserByUsername to throw UsernameNotFoundException"
        );

        assertEquals("User Not Found with email: " + email, exception.getMessage());
        verify(userRepository, times(1)).findByEmail(email);
    }
}