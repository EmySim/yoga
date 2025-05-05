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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.test.context.ActiveProfiles;

import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@Tag("integration")
@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
@AutoConfigureMockMvc
@Transactional
public class SessionDeletionIT {

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
                .setName("Yoga Avancé")
                .setDate(new Date())
                .setDescription("Session avancée pour les experts");
        existingSessionId = sessionRepository.save(session).getId();
    }

    @Test
    public void shouldDeleteExistingSession() throws Exception {
        // Suppression de la session existante
        mockMvc.perform(delete("/api/session/" + existingSessionId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        // Vérifier que la session a été supprimée
        assert sessionRepository.findById(existingSessionId).isEmpty();
    }

    @Test
    public void shouldReturnNotFoundForNonExistentSession() throws Exception {
        // Tentative de suppression d'une session inexistante
        mockMvc.perform(delete("/api/session/9999")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}