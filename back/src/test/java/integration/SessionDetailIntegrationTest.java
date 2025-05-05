package integration;

import com.jayway.jsonpath.JsonPath;
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
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@Tag("integration")
@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
@AutoConfigureMockMvc
@Transactional
public class SessionDetailIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SessionRepository sessionRepository;

    @BeforeEach
    public void setUp() {
        sessionRepository.deleteAll();
    }

    @Test
    public void adminShouldCreateAndRetrieveSessionDetails() throws Exception {
        // Date future formatée correctement
        String futureDate = LocalDateTime.now().plusDays(1)
                .withHour(10).withMinute(0).withSecond(0)
                .format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        // Étape 1 : Création d'une session
        String sessionJson = String.format("""
            {
                "name": "Yoga Avancé",
                "date": "%s",
                "description": "Session avancée pour les experts",
                "teacher_id": 1,
                "users": []
            }
        """, futureDate);

        String response = mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sessionJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga Avancé"))
                .andExpect(jsonPath("$.description").value("Session avancée pour les experts"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Récupération de l'ID
        Integer id = JsonPath.read(response, "$.id");
        Long sessionId = id.longValue();

        // Étape 2 : Récupération des détails de la session
        mockMvc.perform(get("/api/session/" + sessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga Avancé"))
                .andExpect(jsonPath("$.description").value("Session avancée pour les experts"));
    }
}
