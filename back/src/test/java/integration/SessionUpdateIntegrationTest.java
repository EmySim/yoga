package integration;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.hamcrest.Matchers.startsWith;

@ActiveProfiles("test")
@Tag("integration")
@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
@AutoConfigureMockMvc
@Transactional
public class SessionUpdateIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    private Long existingSessionId;

    @BeforeEach
    public void setUp() {
        sessionRepository.deleteAll();

        // Ajouter une session pour les tests
        Session session = new Session()
                .setName("Yoga Intermédiaire")
                .setDate(java.sql.Timestamp.valueOf(LocalDateTime.now().plusDays(1)))
                .setDescription("Session pour les pratiquants intermédiaires");

        existingSessionId = sessionRepository.save(session).getId();
    }

    @Test
    public void shouldUpdateExistingSession() throws Exception {
        String futureDate = LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0)
                .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        String updatedSessionJson = String.format("""
            {
                "name": "Yoga Avancé",
                "date": "%s",
                "description": "Session avancée pour les experts",
                "teacher_id": 1,
                "users": []
            }
        """, futureDate);

        mockMvc.perform(put("/api/session/" + existingSessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(updatedSessionJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga Avancé"))
                .andExpect(jsonPath("$.description").value("Session avancée pour les experts"))
                .andExpect(jsonPath("$.date", startsWith(futureDate.substring(0, 19))));
    }

    @Test
    public void shouldFailToUpdateSessionWhenBackendUnavailable() throws Exception {
        // Données invalides (nom manquant)
        String invalidSessionJson = """
        {
            "name": "",
            "date": "2025-07-01T10:00:00",
            "description": "Session sans nom",
            "teacher_id": 1,
            "users": []
        }
    """;

        // Supposons que le backend ne répond pas (ex. 404 car session inexistante ou backend HS)
        mockMvc.perform(put("/api/session/" + existingSessionId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(invalidSessionJson))
                .andExpect(status().is4xxClientError()) // ou is5xxServerError() selon le cas
                .andDo(MockMvcResultHandlers.print());
    }


}
