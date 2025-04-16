package integration;

import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.TestPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Testcontainers
@TestPropertySource(properties = {
        "spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver"
})
class AuthControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Container
    static MySQLContainer<?> mysqlContainer = new MySQLContainer<>("mysql:8.0")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @DynamicPropertySource
    static void overrideProps(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", mysqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", mysqlContainer::getUsername);
        registry.add("spring.datasource.password", mysqlContainer::getPassword);
    }

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        User user = new User();
        user.setEmail("validUser@example.com");
        user.setPassword(passwordEncoder.encode("validPassword"));
        user.setFirstName("Valid");
        user.setLastName("User");

        userRepository.save(user);
    }

    @Test
    void testLoginWithValidCredentials() {
        String url = "http://localhost:" + port + "/api/auth/login";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String validCredentials = "{\"username\": \"validUser@example.com\", \"password\": \"validPassword\"}";
        HttpEntity<String> request = new HttpEntity<>(validCredentials, headers);

        ResponseEntity<JwtResponse> response = restTemplate.exchange(url, HttpMethod.POST, request, JwtResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getToken()).isNotEmpty();
    }

    @Test
    void testLoginWithInvalidCredentials() {
        String url = "http://localhost:" + port + "/api/auth/login";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String invalidCredentials = "{\"username\": \"invalid@example.com\", \"password\": \"wrongPassword\"}";
        HttpEntity<String> request = new HttpEntity<>(invalidCredentials, headers);

        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, request, String.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).contains("Bad credentials");
    }

    @Test
    void testJwtGeneration() {
        String url = "http://localhost:" + port + "/api/auth/login";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String validCredentials = "{\"username\": \"validUser@example.com\", \"password\": \"validPassword\"}";
        HttpEntity<String> request = new HttpEntity<>(validCredentials, headers);

        ResponseEntity<JwtResponse> response = restTemplate.exchange(url, HttpMethod.POST, request, JwtResponse.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getToken()).startsWith("Bearer ");
    }
}
