package com.openclassrooms.starterjwt.controllerstest;

import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.services.SessionService;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@Tag("unit")
public class SessionControllerTest {

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    @InjectMocks
    private SessionController sessionController;
    private AutoCloseable closeable;

    @BeforeEach
    void setUp() {
        closeable = MockitoAnnotations.openMocks(this);
    }

    @AfterEach
    void tearDown() throws Exception {
        closeable.close();
    }

    @Test
    void testFindById_success() {
        Long id = 1L;
        Session session = new Session();
        SessionDto sessionDto = new SessionDto();

        when(sessionService.getById(id)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        ResponseEntity<?> response = sessionController.findById("1");

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sessionDto, response.getBody());
    }

    @Test
    void testFindById_notFound() {
        when(sessionService.getById(1L)).thenReturn(null);

        ResponseEntity<?> response = sessionController.findById("1");

        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void testFindById_badRequest() {
        ResponseEntity<?> response = sessionController.findById("invalid");

        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void testFindAll_success() {
        List<Session> sessions = Arrays.asList(new Session(), new Session());
        List<SessionDto> sessionDtos = Arrays.asList(new SessionDto(), new SessionDto());

        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        ResponseEntity<?> response = sessionController.findAll();

        assertEquals(200, response.getStatusCode().value());
        assertEquals(sessionDtos, response.getBody());
    }

    @Test
    void testCreate_success() {
        SessionDto dto = new SessionDto();
        dto.setName("Session Name");
        dto.setDate(new Date());
        dto.setTeacher_id(1L);
        dto.setDescription("Session Description");

        Session entity = new Session();
        entity.setName("Session Name");
        entity.setDate(new Date());
        entity.setDescription("Session Description");

        when(sessionMapper.toEntity(dto)).thenReturn(entity);
        when(sessionService.create(entity)).thenReturn(entity);
        when(sessionMapper.toDto(entity)).thenReturn(dto);

        ResponseEntity<?> response = sessionController.create(dto);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(dto, response.getBody());
    }

    @Test
    void testUpdate_success() {
        SessionDto dto = new SessionDto();
        Session entity = new Session();

        when(sessionMapper.toEntity(dto)).thenReturn(entity);
        when(sessionService.update(1L, entity)).thenReturn(entity);
        when(sessionMapper.toDto(entity)).thenReturn(dto);

        ResponseEntity<?> response = sessionController.update("1", dto);

        assertEquals(200, response.getStatusCode().value());
        assertEquals(dto, response.getBody());
    }

    @Test
    void testUpdate_badRequest() {
        SessionDto dto = new SessionDto();

        ResponseEntity<?> response = sessionController.update("invalid", dto);

        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void testDelete_success() {
        Session session = new Session();
        when(sessionService.getById(1L)).thenReturn(session);

        ResponseEntity<?> response = sessionController.save("1");

        verify(sessionService).delete(1L);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void testDelete_notFound() {
        when(sessionService.getById(1L)).thenReturn(null);

        ResponseEntity<?> response = sessionController.save("1");

        assertEquals(404, response.getStatusCode().value());
    }

    @Test
    void testDelete_badRequest() {
        ResponseEntity<?> response = sessionController.save("invalid");

        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void testParticipate_success() {
        ResponseEntity<?> response = sessionController.participate("1", "2");

        verify(sessionService).participate(1L, 2L);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void testParticipate_badRequest() {
        ResponseEntity<?> response = sessionController.participate("one", "two");

        assertEquals(400, response.getStatusCode().value());
    }

    @Test
    void testNoLongerParticipate_success() {
        ResponseEntity<?> response = sessionController.noLongerParticipate("1", "2");

        verify(sessionService).noLongerParticipate(1L, 2L);
        assertEquals(200, response.getStatusCode().value());
    }

    @Test
    void testNoLongerParticipate_badRequest() {
        ResponseEntity<?> response = sessionController.noLongerParticipate("invalid", "value");

        assertEquals(400, response.getStatusCode().value());
    }
}