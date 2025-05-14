package com.openclassrooms.starterjwt.payloadtest.requesttest;

import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;
@Tag("unit")
public class SignUpRequestTest {

    @Test
    void testGettersAndSetters() {
        SignupRequest signupRequest = new SignupRequest();

        String email = "test@example.com";
        String firstName = "John";
        String lastName = "Doe";
        String password = "password123";

        signupRequest.setEmail(email);
        signupRequest.setFirstName(firstName);
        signupRequest.setLastName(lastName);
        signupRequest.setPassword(password);

        assertEquals(email, signupRequest.getEmail());
        assertEquals(firstName, signupRequest.getFirstName());
        assertEquals(lastName, signupRequest.getLastName());
        assertEquals(password, signupRequest.getPassword());
    }

    @Test
    void testDefaultConstructor() {
        SignupRequest signupRequest = new SignupRequest();

        assertNull(signupRequest.getEmail());
        assertNull(signupRequest.getFirstName());
        assertNull(signupRequest.getLastName());
        assertNull(signupRequest.getPassword());
    }

    @Test
    void testSetEmailWithNullValue() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail(null);
        assertNull(signupRequest.getEmail());
    }

    @Test
    void testSetFirstNameWithNullValue() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setFirstName(null);
        assertNull(signupRequest.getFirstName());
    }

    @Test
    void testSetLastNameWithNullValue() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setLastName(null);
        assertNull(signupRequest.getLastName());
    }

    @Test
    void testSetPasswordWithNullValue() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setPassword(null);
        assertNull(signupRequest.getPassword());
    }

    @Test
    void testToString() {
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setFirstName("John");
        signupRequest.setLastName("Doe");
        signupRequest.setPassword("password123");

        String expectedString = "SignupRequest(email=test@example.com, firstName=John, lastName=Doe, password=password123)";
        assertEquals(expectedString, signupRequest.toString());
    }

    @Test
    void testEqualsAndHashCode() {
        SignupRequest request1 = new SignupRequest();
        request1.setEmail("test@example.com");
        request1.setFirstName("John");
        request1.setLastName("Doe");
        request1.setPassword("password123");

        SignupRequest request2 = new SignupRequest();
        request2.setEmail("test@example.com");
        request2.setFirstName("John");
        request2.setLastName("Doe");
        request2.setPassword("password123");

        SignupRequest request3 = new SignupRequest();
        request3.setEmail("another@example.com");
        request3.setFirstName("Jane");
        request3.setLastName("Smith");
        request3.setPassword("diffpass");

        assertEquals(request1, request2);
        assertNotEquals(request1, request3);

        assertEquals(request1.hashCode(), request2.hashCode());
        assertNotEquals(request1.hashCode(), request3.hashCode());
    }

    @Test
    void testEquals() {
        SignupRequest request1 = new SignupRequest();
        SignupRequest request2 = new SignupRequest();
        Object otherObject = new Object();

        assertEquals(request1, request2, "Les deux objets SignupRequest devraient être égaux.");
        assertNotEquals(request1, otherObject, "SignupRequest ne devrait pas être égal à un objet d'un autre type.");
    }
}
