package com.openclassrooms.starterjwt.securitytest;

import com.openclassrooms.starterjwt.security.WebSecurityConfig;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import static org.assertj.core.api.Assertions.assertThat;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
@Tag("unit")
@SpringBootTest
@Import(WebSecurityConfig.class)
class WebSecurityConfigTest {

    @MockBean
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private SecurityFilterChain securityFilterChain;

    @Test
    void passwordEncoder_shouldBeBCrypt() {
        assertThat(passwordEncoder).isNotNull();
        assertThat(passwordEncoder.getClass().getSimpleName()).isEqualTo("BCryptPasswordEncoder");
    }

    @Test
    void securityFilterChain_shouldBeCreated() {
        assertThat(securityFilterChain).isNotNull();
    }
}
