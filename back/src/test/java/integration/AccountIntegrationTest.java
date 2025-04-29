package integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.test.context.TestPropertySource;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;

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
        "oc.app.jwtSecret=openclassroomsopenclassroomsopenclassrooms"
})
public class AccountIntegrationTest {

    private static final Logger logger = LoggerFactory.getLogger(AccountIntegrationTest.class);
    private static final String JWT_SECRET = "openclassroomsopenclassroomsopenclassrooms";

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
    }

    private String generateJwtToken(String email) {
        SecretKey key = Keys.hmacShaKeyFor(JWT_SECRET.getBytes(StandardCharsets.UTF_8));
        return "Bearer " + Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
                .signWith(key, SignatureAlgorithm.HS512) // Correspond à JwtUtils
                .compact();
    }

    @Test
    public void shouldReturnUserInfoWithValidToken() throws Exception {
        String url = "http://localhost:" + port + "/api/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set(HttpHeaders.AUTHORIZATION, jwtToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);

        ObjectMapper mapper = new ObjectMapper();
        JsonNode json = mapper.readTree(response.getBody());

        assertThat(json.get("email").asText()).isEqualTo("testuser@example.com");
        assertThat(json.get("firstName").asText()).isEqualTo("Test");
        assertThat(json.get("lastName").asText()).isEqualTo("User");
        assertThat(json.get("admin").asBoolean()).isFalse();
    }

    @Test
    public void shouldReturnUnauthorizedWithoutToken() {
        String url = "http://localhost:" + port + "/api/user/me";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
    }
}
