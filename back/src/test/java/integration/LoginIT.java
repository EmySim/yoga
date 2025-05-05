package integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.config.TestSecurityConfig;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ActiveProfiles("test")
@Tag("integration")
@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
public class LoginIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    // ✅ Cas passant : login de l'utilisateur réel "zaza@zaza.com"
    @Test
    void testLoginWithValidCredentials() throws Exception {
        var credentials = new LoginRequest("zaza@zaza.com", "zaza123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.id", notNullValue()));
    }

    // ❌ Cas non passant : mauvais mot de passe
    @Test
    void testLoginWithInvalidCredentials() throws Exception {
        var credentials = new LoginRequest("zaza@zaza.com", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isUnauthorized())
                .andDo(MockMvcResultHandlers.print());
        // Le test s'arrête à la vérification du code HTTP
        // On n'attend plus de message JSON dans le corps
    }

    // ❌ Cas non passant : email inexistant
    @Test
    void testLoginWithUnknownUser() throws Exception {
        var credentials = new LoginRequest("unknown@nope.com", "zaza123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isUnauthorized())
                .andDo(MockMvcResultHandlers.print());
        // Idem ici : on ne vérifie que le statut HTTP
    }

    // DTO interne
    private record LoginRequest(String email, String password) {}
}
