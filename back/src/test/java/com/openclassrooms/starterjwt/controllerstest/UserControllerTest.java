package com.openclassrooms.starterjwt.controllerstest;

import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@Tag("unit")
@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserController userController;

    private final User testUser = User.builder()
            .id(1L)
            .email("test@example.com")
            .lastName("Doe")
            .firstName("John")
            .password("password")
            .admin(false)
            .build();

    @BeforeEach
    void setupSecurityContext() {
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername("test@example.com")
                .password("password")
                .roles("USER")
                .build();
        SecurityContextHolder.getContext().setAuthentication(
                new TestingAuthenticationToken(userDetails, null)
        );
    }

    @Test
    void findById_should_return_userDto_when_user_exists() {
        UserDto dto = new UserDto();
        dto.setId(1L);
        dto.setEmail("test@example.com");

        when(userService.findById(1L)).thenReturn(testUser);
        when(userMapper.toDto(testUser)).thenReturn(dto);

        ResponseEntity<?> response = userController.findById("1");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, response.getBody());
    }

    @Test
    void findById_should_return_not_found_when_user_does_not_exist() {
        when(userService.findById(99L)).thenReturn(null);

        ResponseEntity<?> response = userController.findById("99");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void findById_should_return_bad_request_when_id_is_invalid() {
        ResponseEntity<?> response = userController.findById("abc");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void delete_should_return_ok_when_authenticated_user_matches_and_user_exists() {
        when(userService.findById(1L)).thenReturn(testUser);

        ResponseEntity<?> response = userController.save("1");

        verify(userService, times(1)).delete(1L);
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void delete_should_return_unauthorized_when_authenticated_user_does_not_match() {
        User otherUser = User.builder()
                .id(1L)
                .email("other@example.com")
                .lastName("Smith")
                .firstName("Jane")
                .password("password")
                .admin(false)
                .build();

        when(userService.findById(1L)).thenReturn(otherUser);

        ResponseEntity<?> response = userController.save("1");

        verify(userService, never()).delete(anyLong());
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }

    @Test
    void delete_should_return_not_found_when_user_does_not_exist() {
        when(userService.findById(404L)).thenReturn(null);

        ResponseEntity<?> response = userController.save("404");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void delete_should_return_bad_request_when_id_is_invalid() {
        ResponseEntity<?> response = userController.save("xyz");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
