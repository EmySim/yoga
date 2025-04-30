package integration;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.config.TestSecurityConfig;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Import;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Tag;

@Tag("integration")
@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        classes = SpringBootSecurityJwtApplication.class
)
@Import(TestSecurityConfig.class)
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=password",
        "spring.jpa.hibernate.ddl-auto=update",
        "spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect",
        "spring.jpa.show-sql=true",
        "spring.security.oauth2.resourceserver.jwt.issuer-uri=",
        "spring.security.oauth2.resourceserver.jwt.jwk-set-uri=",
        "server.error.include-message=always"
})
class LoginIntegrationTest {

    private static final Logger logger = LoggerFactory.getLogger(LoginIntegrationTest.class);

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        logger.info("🧹 Nettoyage de la base de données...");
        userRepository.deleteAll();

        logger.info("📦 Insertion d’un utilisateur valide en base");
        User user = new User();
        user.setEmail("validUser@example.com");
        user.setPassword(passwordEncoder.encode("validPassword"));
        user.setFirstName("Valid");
        user.setLastName("User");

        userRepository.save(user);
        logger.info("✅ Utilisateur inséré : {}", user.getEmail());
    }

    @Test
    void testLoginWithValidCredentials() {
        String url = "http://localhost:" + port + "/api/auth/login";
        logger.info("➡️ Envoi d'une requête POST à {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String validCredentials = "{\"email\": \"validUser@example.com\", \"password\": \"validPassword\"}";
        HttpEntity<String> request = new HttpEntity<>(validCredentials, headers);

        ResponseEntity<JwtResponse> response = restTemplate.exchange(url, HttpMethod.POST, request, JwtResponse.class);

        logger.info("📥 Réponse reçue : {}", response);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();

        String token = response.getBody().getToken();
        logger.info("🔐 JWT généré : {}", token);
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    void testLoginWithInvalidCredentials() {
        String url = "http://localhost:" + port + "/api/auth/login";
        logger.info("➡️ Tentative de connexion avec identifiants invalides : {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String invalidCredentials = "{\"email\": \"invalid@example.com\", \"password\": \"wrongPassword\"}";
        HttpEntity<String> request = new HttpEntity<>(invalidCredentials, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

        logger.info("📥 Réponse : {}", response);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }


    @Test
    void testUnauthorizedAccess() {
        String url = "http://localhost:" + port + "/api/protected-resource";
        logger.info("🔐 Tentative d'accès non autorisée à {}", url);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> request = new HttpEntity<>(null, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

        logger.info("📥 Réponse : {}", response);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }

    @Test
    void testJwtGeneration() {
        String url = "http://localhost:" + port + "/api/auth/login";
        logger.info("🔄 Vérification de la génération d'un JWT valide");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String validCredentials = "{\"email\": \"validUser@example.com\", \"password\": \"validPassword\"}";
        HttpEntity<String> request = new HttpEntity<>(validCredentials, headers);

        ResponseEntity<JwtResponse> response = restTemplate.exchange(url, HttpMethod.POST, request, JwtResponse.class);

        logger.info("📥 Réponse : {}", response);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();

        String token = response.getBody().getToken();
        logger.info("🔐 JWT : {}", token);
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3);
    }
}
