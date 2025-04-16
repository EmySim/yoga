package integration;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, classes = SpringBootSecurityJwtApplication.class)
class RegisterIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void registerUser_shouldCreateUserSuccessfully() {
        // Création d'un utilisateur valide
        SignupRequest request = new SignupRequest();
        request.setEmail("newuser@example.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("password123");

        ResponseEntity<String> response = restTemplate.postForEntity("/api/auth/register", request, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("User registered successfully!");
    }

    @Test
    void registerUser_shouldFailForDuplicateEmail() {
        // Création d'un utilisateur avec un email déjà existant
        SignupRequest request = new SignupRequest();
        request.setEmail("existinguser@example.com");
        request.setFirstName("Jane");
        request.setLastName("Doe");
        request.setPassword("password123");

        // Premier enregistrement
        restTemplate.postForEntity("/api/auth/register", request, String.class);

        // Deuxième enregistrement avec le même email
        ResponseEntity<String> response = restTemplate.postForEntity("/api/auth/register", request, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).contains("Error: Email is already taken!");
    }

    @Test
    void registerUser_shouldFailForInvalidData() {
        // Création d'un utilisateur avec des données invalides
        SignupRequest request = new SignupRequest();
        request.setEmail("invalid-email"); // Email invalide
        request.setFirstName(""); // Prénom vide
        request.setLastName("Doe");
        request.setPassword("123"); // Mot de passe trop court

        ResponseEntity<String> response = restTemplate.postForEntity("/api/auth/register", request, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }
}