package com.openclassrooms.starterjwt.securitytest.jwttest;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.core.Authentication;
import org.springframework.test.util.ReflectionTestUtils;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;
    private SecretKey secretKey;
    private final String jwtSecret = "UnePhraseSecrèteUltraLongueQuiDépasseBienLes64CaractèresMinimumRequisPourHS512!!!";

    @BeforeEach
    public void setUp() {
        jwtUtils = new JwtUtils();
        secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        // Injecte les valeurs dans la classe JwtUtils
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", jwtSecret);
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000); // 1h
    }

    @Test
    public void testGenerateJwtToken() {
        Authentication authentication = Mockito.mock(Authentication.class);
        UserDetailsImpl userDetails = new UserDetailsImpl(
                1L, "testuser", "Test", "User", false, "password");

        when(authentication.getPrincipal()).thenReturn(userDetails);

        String token = jwtUtils.generateJwtToken(authentication);
        assertNotNull(token);

        Jws<Claims> claimsJws = Jwts.parserBuilder().setSigningKey(secretKey).build().parseClaimsJws(token);
        Claims claims = claimsJws.getBody();

        assertEquals("testuser", claims.getSubject());
        assertTrue(claims.getExpiration().after(new Date()));
    }

    @Test
    public void testGetUserNameFromJwtToken() {
        String token = Jwts.builder()
                .setSubject("testuser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 3600000)) // 1h
                .signWith(secretKey, io.jsonwebtoken.SignatureAlgorithm.HS512)
                .compact();

        String username = jwtUtils.getUserNameFromJwtToken(token);
        assertEquals("testuser", username);
    }

    @Test
    public void testValidateJwtToken() {
        String validToken = Jwts.builder()
                .setSubject("testuser")
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + 3600000)) // 1h
                .signWith(secretKey, io.jsonwebtoken.SignatureAlgorithm.HS512)
                .compact();

        assertTrue(jwtUtils.validateJwtToken(validToken));

        String invalidToken = validToken + "invalid";
        assertFalse(jwtUtils.validateJwtToken(invalidToken));
    }
}
