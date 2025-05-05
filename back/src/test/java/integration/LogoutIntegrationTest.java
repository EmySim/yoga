package integration;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.config.TestSecurityConfig;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
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
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import javax.crypto.SecretKey;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
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
        "server.error.include-message=always",
        "oc.app.jwtSecret=openclassrooms"
})
public class LogoutIntegrationTest {

    private static final Logger logger = LoggerFactory.getLogger(LogoutIntegrationTest.class);

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private String jwtToken;

    @BeforeEach
    public void setUp() {
        logger.info("🧹 Nettoyage de la base de données...");
        userRepository.deleteAll();

        logger.info("📦 Insertion d’un utilisateur valide en base");
        User user = new User()
                .setEmail("testuser@example.com")
                .setPassword(passwordEncoder.encode("testpassword"))
                .setFirstName("Test")
                .setLastName("User")
                .setAdmin(false);
        userRepository.save(user);

        logger.info("🔐 Génération d'un JWT valide...");
        this.jwtToken = generateJwtToken("testuser@example.com");
        logger.info("✅ Token généré avec succès : {}", jwtToken);
    }

    private String generateJwtToken(String email) {
        // Utilisez une clé d'au moins 32 caractères
        String secret = "openclassroomsopenclassroomsopenclassrooms"; // 32 caractères minimum
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());

        return "Bearer " + Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 heures
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    @Test
    public void shouldLogoutSuccessfully() {
        String url = "http://localhost:" + port + "/api/auth/logout";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set(HttpHeaders.AUTHORIZATION, jwtToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        logger.info("➡️ Envoi d'une requête de déconnexion à {}", url);
        ResponseEntity<Void> response = restTemplate.exchange(url, HttpMethod.POST, request, Void.class);

        logger.info("📥 Réponse : {}", response);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    public void shouldReturnUnauthorizedAfterLogout() {
        String logoutUrl = "http://localhost:" + port + "/api/auth/logout";
        String protectedUrl = "http://localhost:" + port + "/api/user/me";

        // Déconnexion
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set(HttpHeaders.AUTHORIZATION, jwtToken);
        HttpEntity<Void> logoutRequest = new HttpEntity<>(headers);

        logger.info("➡️ Envoi d'une requête de déconnexion à {}", logoutUrl);
        restTemplate.exchange(logoutUrl, HttpMethod.POST, logoutRequest, Void.class);

        // Tentative d'accès à une ressource protégée après déconnexion
        HttpEntity<Void> protectedRequest = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(protectedUrl, HttpMethod.GET, protectedRequest, String.class);

        logger.info("📥 Réponse après déconnexion : {}", response);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}