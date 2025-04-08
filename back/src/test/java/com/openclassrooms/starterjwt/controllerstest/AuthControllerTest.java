package com.openclassrooms.starterjwt.controllerstest;

import com.openclassrooms.starterjwt.controllers.AuthController;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthController authController;

    @Test
    void should_return_bad_request_when_email_already_exists() {
        // Given
        SignupRequest request = new SignupRequest();
        request.setEmail("test@example.com");
        request.setFirstName("Jean");
        request.setLastName("Dupont");
        request.setPassword("motdepasse123");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // When
        ResponseEntity<?> response = authController.registerUser(request);

        // Then
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertInstanceOf(MessageResponse.class, response.getBody());
        assertEquals("Error: Email is already taken!", ((MessageResponse) response.getBody()).getMessage());

        verify(userRepository, times(1)).existsByEmail("test@example.com");
        verify(userRepository, never()).save(any());
    }

    @Test
    void should_register_user_successfully_when_email_not_exists() {
        // Given
        SignupRequest request = new SignupRequest();
        request.setEmail("newuser@example.com");
        request.setFirstName("Marie");
        request.setLastName("Curie");
        request.setPassword("radium42");

        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(passwordEncoder.encode("radium42")).thenReturn("encoded_password");

        // When
        ResponseEntity<?> response = authController.registerUser(request);

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertInstanceOf(MessageResponse.class, response.getBody());
        assertEquals("User registered successfully!", ((MessageResponse) response.getBody()).getMessage());

        verify(userRepository).save(any(User.class));
    }
}
