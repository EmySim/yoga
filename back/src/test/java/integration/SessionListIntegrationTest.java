package integration;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@Tag("integration")
@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
@AutoConfigureMockMvc
@Transactional
public class SessionListIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @BeforeEach
    public void setUp() {
        sessionRepository.deleteAll();

        // Ajouter des sessions dans la base de données pour les tests
        Session session1 = new Session()
                .setName("Yoga Matinal")
                .setDate(new Date())
                .setDescription("Session de yoga pour bien commencer la journée");

        Session session2 = new Session()
                .setName("Yoga du Soir")
                .setDate(new Date())
                .setDescription("Session de yoga pour se détendre en soirée");

        sessionRepository.saveAll(List.of(session1, session2));
    }

    @Test
    public void shouldReturnListOfSessions() throws Exception {
        mockMvc.perform(get("/api/session")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("Yoga Matinal"))
                .andExpect(jsonPath("$[1].name").value("Yoga du Soir"));
    }

    @Test
    public void shouldReturnEmptyListWhenNoSessionsExist() throws Exception {
        // Supprimer toutes les sessions pour simuler une base vide
        sessionRepository.deleteAll();

        mockMvc.perform(get("/api/session")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    public void shouldReturnSessionDetailsCorrectly() throws Exception {
        List<Session> sessions = sessionRepository.findAll();
        Long sessionId = sessions.get(0).getId();

        mockMvc.perform(get("/api/session/" + sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga Matinal"))
                .andExpect(jsonPath("$.description").value("Session de yoga pour bien commencer la journée"));
    }

    @Test
    public void shouldReturnBadRequestForInvalidSessionId() throws Exception {
        mockMvc.perform(get("/api/session/invalid-id")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void shouldReturnNotFoundForNonExistentSessionId() throws Exception {
        mockMvc.perform(get("/api/session/9999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
