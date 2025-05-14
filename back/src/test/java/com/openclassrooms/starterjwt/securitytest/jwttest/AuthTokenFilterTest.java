package com.openclassrooms.starterjwt.securitytest.jwttest;

import com.openclassrooms.starterjwt.security.jwt.AuthTokenFilter;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;
@Tag("unit")
class AuthTokenFilterTest {

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private HttpServletRequest mockRequest;

    @Mock
    private HttpServletResponse mockResponse;

    @Mock
    private FilterChain filterChain;

    private AuthTokenFilter authTokenFilter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authTokenFilter = new AuthTokenFilter();
        authTokenFilter.jwtUtils = jwtUtils;
        authTokenFilter.userDetailsService = userDetailsService;

        // Réinitialiser le contexte de sécurité avant chaque test
        SecurityContextHolder.clearContext();
    }

    @Test
    void testDoFilterInternal_shouldAuthenticateUserWhenJwtIsValid() throws Exception {
        // Given
        String validJwt = "valid-jwt-token";
        String username = "testUser";
        UserDetails userDetails = User.builder().username(username).password("password").roles("USER").build();

        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer " + validJwt);
        when(jwtUtils.validateJwtToken(validJwt)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(validJwt)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(userDetails);

        // When
        authTokenFilter.doFilterInternal(mockRequest, mockResponse, filterChain);

        // Then
        UsernamePasswordAuthenticationToken authentication = (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();
        assertNotNull(authentication);
        assertEquals(username, authentication.getName());
        assertTrue(authentication.getAuthorities().stream().anyMatch(authority -> authority.getAuthority().equals("ROLE_USER")));
        verify(filterChain).doFilter(mockRequest, mockResponse);  // Ensure the filter chain is continued
    }

    @Test
    void testDoFilterInternal_shouldNotAuthenticateUserWhenJwtIsInvalid() throws Exception {
        // Given
        String invalidJwt = "invalid-jwt-token";

        when(mockRequest.getHeader("Authorization")).thenReturn("Bearer " + invalidJwt);
        when(jwtUtils.validateJwtToken(invalidJwt)).thenReturn(false);

        // When
        authTokenFilter.doFilterInternal(mockRequest, mockResponse, filterChain);

        // Then
        assertNull(SecurityContextHolder.getContext().getAuthentication()); // Authentication should be null
        verify(filterChain).doFilter(mockRequest, mockResponse);  // Ensure the filter chain is continued
    }

    @Test
    void testDoFilterInternal_shouldNotAuthenticateUserWhenJwtIsMissing() throws Exception {
        // Given
        when(mockRequest.getHeader("Authorization")).thenReturn(null);

        // When
        authTokenFilter.doFilterInternal(mockRequest, mockResponse, filterChain);

        // Then
        assertNull(SecurityContextHolder.getContext().getAuthentication()); // Authentication should be null
        verify(filterChain).doFilter(mockRequest, mockResponse);  // Ensure the filter chain is continued
    }
}
