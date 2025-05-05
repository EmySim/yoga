package integration;

import com.jayway.jsonpath.JsonPath;
import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.dto.SessionDto;
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

import java.util.Date;

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
        // Étape 1 : Création d'une session
        String sessionJson = """
                    {
                        "name": "Yoga Avancé",
                        "date": "2025-05-01T10:00:00",
                        "description": "Session avancée pour les experts",
                        "teacher_id": 1,
                        "users": []
                    }
                """;

        String response = mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(sessionJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Yoga Avancé"))
                .andExpect(jsonPath("$.description").value("Session avancée pour les experts"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Récupérer l'ID de la session créée
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
