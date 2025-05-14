package com.openclassrooms.starterjwt.securitytest.jwttest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.WriteListener;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;

import java.io.ByteArrayOutputStream;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@Tag("unit")
class AuthEntryPointJwtTest {

    private AuthEntryPointJwt authEntryPointJwt;
    private HttpServletRequest mockRequest;
    private HttpServletResponse mockResponse;
    private AuthenticationException mockAuthException;

    private ByteArrayOutputStream responseContent;

    @BeforeEach
    void setUp() throws Exception {
        authEntryPointJwt = new AuthEntryPointJwt();
        mockRequest = mock(HttpServletRequest.class);
        mockResponse = mock(HttpServletResponse.class);
        mockAuthException = mock(AuthenticationException.class);

        when(mockRequest.getServletPath()).thenReturn("/api/test");
        when(mockAuthException.getMessage()).thenReturn("Unauthorized access");

        responseContent = new ByteArrayOutputStream();

        ServletOutputStream outputStream = new ServletOutputStream() {
            @Override
            public void write(int b) {
                responseContent.write(b);
            }

            @Override
            public boolean isReady() {
                return true; // Implémentation minimale
            }

            @Override
            public void setWriteListener(WriteListener writeListener) {
                // Implémentation vide pour le test
            }
        };

        when(mockResponse.getOutputStream()).thenReturn(outputStream);
    }

    @Test
    void commence_should_return_json_unauthorized_response() throws Exception {
        authEntryPointJwt.commence(mockRequest, mockResponse, mockAuthException);

        verify(mockResponse).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(mockResponse).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String json = responseContent.toString();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> responseMap = mapper.readValue(json, new TypeReference<>() {
        });

        assertEquals(401, responseMap.get("status"));
        assertEquals("Unauthorized", responseMap.get("error"));
        assertEquals("Unauthorized access", responseMap.get("message"));
        assertEquals("/api/test", responseMap.get("path"));
    }
}