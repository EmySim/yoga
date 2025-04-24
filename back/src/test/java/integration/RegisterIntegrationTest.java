package integration;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.config.TestSecurityConfig;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = {SpringBootSecurityJwtApplication.class, TestSecurityConfig.class}
)
@Transactional
class RegisterIntegrationTest {

    private static final Logger logger = LoggerFactory.getLogger(RegisterIntegrationTest.class);

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    void registerUser_shouldCreateUserSuccessfully() {
        logger.info("🚀 Test - registerUser_shouldCreateUserSuccessfully");

        String uniqueEmail = "newuser" + System.currentTimeMillis() + "@example.com";

        SignupRequest request = new SignupRequest();
        request.setEmail(uniqueEmail);
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("password123");

        logger.info("📤 Envoi d'une requête POST à /api/auth/register avec un utilisateur valide : {}", request.getEmail());
        ResponseEntity<String> response = restTemplate.postForEntity("/api/auth/register", request, String.class);

        logger.info("📥 Réponse reçue : Status = {}, Body = {}", response.getStatusCode(), response.getBody());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("User registered successfully!");

        logger.info("✅ L'utilisateur a été enregistré avec succès !");
    }

    @Test
    void registerUser_shouldFailForDuplicateEmail() {
        logger.info("🚀 Test - registerUser_shouldFailForDuplicateEmail");

        String uniqueEmail = "existinguser" + System.currentTimeMillis() + "@example.com";

        SignupRequest request = new SignupRequest();
        request.setEmail(uniqueEmail);
        request.setFirstName("Jane");
        request.setLastName("Doe");
        request.setPassword("password123");

        logger.info("📤 Envoi du premier enregistrement avec l'email : {}", request.getEmail());
        restTemplate.postForEntity("/api/auth/register", request, String.class);

        logger.info("📤 Tentative de deuxième enregistrement avec le même email");
        ResponseEntity<String> response = restTemplate.postForEntity("/api/auth/register", request, String.class);

        logger.info("📥 Réponse reçue : Status = {}, Body = {}", response.getStatusCode(), response.getBody());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).contains("Error: Email is already taken!");

        logger.info("✅ Échec attendu pour email en double confirmé !");
    }

    @Test
    void registerUser_shouldFailForInvalidData() {
        logger.info("🚀 Test - registerUser_shouldFailForInvalidData");

        SignupRequest request = new SignupRequest();
        request.setEmail("invalid-email");
        request.setFirstName("");
        request.setLastName("Doe");
        request.setPassword("123");

        logger.info("📤 Envoi d'une requête avec données invalides : email='{}', firstName='{}', password='{}'",
                request.getEmail(), request.getFirstName(), request.getPassword());

        ResponseEntity<String> response = restTemplate.postForEntity("/api/auth/register", request, String.class);

        logger.info("📥 Réponse reçue : Status = {}, Body = {}", response.getStatusCode(), response.getBody());

        // Si la réponse est une redirection, vérifier qu'elle ne redirige pas vers une page incorrecte
        if (response.getStatusCode() == HttpStatus.FOUND) {
            String redirectUrl = response.getHeaders().getLocation().toString();
            logger.info("⛔ La requête a été redirigée : {}", redirectUrl);
            // Vérifie que la redirection est celle attendue par Spring Security
            assertThat(redirectUrl).contains("/login");
        } else {
            // Si ce n'est pas une redirection, vérifier que la réponse est bien 400
            assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        }

        logger.info("✅ Échec attendu pour données invalides confirmé !");
    }

}