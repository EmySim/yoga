package integration;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.config.TestSecurityConfig;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;  // Assure-toi d'importer cette ligne

@Tag("integration")
@ActiveProfiles("test")
@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
@AutoConfigureMockMvc
@Import(TestSecurityConfig.class)
@TestPropertySource(locations = "classpath:application-test.properties")
public class LogoutIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @WithMockUser(username = "testuser@example.com", roles = {"USER"})
    public void shouldLogoutSuccessfully() throws Exception {
        mockMvc.perform(post("/logout"))  // Utiliser le point de terminaison "/logout"
                .andExpect(status().is3xxRedirection())  // Vérifie que la redirection a lieu
                .andExpect(header().string("Location", "/login?logout"));  // Vérifie la redirection vers /login?logout
    }


    @Test
    @WithMockUser(username = "testuser@example.com", roles = {"USER"})
    public void shouldReturnNotFoundWhenLogoutEndpointDoesNotExist() throws Exception {
        mockMvc.perform(post("/api/auth/logout"))
                .andExpect(status().isNotFound());
    }
}
