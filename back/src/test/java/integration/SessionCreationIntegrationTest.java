package integration;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.startsWith;

@Tag("integration")
@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
@AutoConfigureMockMvc
@Transactional
public class SessionCreationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @BeforeEach
    public void setUp() {
        sessionRepository.deleteAll();
    }

    @Test
    public void shouldCreateSessionAndReturnCorrectInfo() throws Exception {
        // Données de la session à créer
        String sessionJson = """
            {
                "name": "Yoga Débutant",
                "date": "2025-06-15T09:00:00",
                "description": "Session pour les débutants",
                "teacher_id": 1,
                "users": []
            }
        """;

        // Création de la session
        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sessionJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga Débutant"))
                .andExpect(jsonPath("$.description").value("Session pour les débutants"))
                .andExpect(jsonPath("$.teacher_id").value(1))
                .andExpect(jsonPath("$.date", startsWith("2025-06-15T09:00:00")));
    }
}
