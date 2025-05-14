package com.openclassrooms.starterjwt.servicestest;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@Tag("unit")
class SessionServiceTest {

    private SessionRepository sessionRepository;
    private UserRepository userRepository;
    private SessionService sessionService;

    @BeforeEach
    void setUp() {
        sessionRepository = mock(SessionRepository.class);
        userRepository = mock(UserRepository.class);
        sessionService = new SessionService(sessionRepository, userRepository);
    }

    @Test
    void testCreateSession() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session created = sessionService.create(session);
        assertEquals(session, created);
    }

    @Test
    void testDeleteSession() {
        Long id = 1L;

        sessionService.delete(id);
        verify(sessionRepository, times(1)).deleteById(id);
    }

    @Test
    void testFindAllSessions() {
        List<Session> sessions = List.of(new Session(), new Session());
        when(sessionRepository.findAll()).thenReturn(sessions);

        List<Session> result = sessionService.findAll();
        assertEquals(2, result.size());
    }

    @Test
    void testGetByIdFound() {
        Session session = new Session();
        when(sessionRepository.findById(1L)).thenReturn(Optional.of(session));

        assertEquals(session, sessionService.getById(1L));
    }

    @Test
    void testGetByIdNotFound() {
        when(sessionRepository.findById(1L)).thenReturn(Optional.empty());

        assertNull(sessionService.getById(1L));
    }

    @Test
    void testUpdateSession() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session updated = sessionService.update(1L, session);
        assertEquals(session, updated);
        assertEquals(1L, session.getId());
    }

    @Test
    void testParticipateSuccess() {
        Long sessionId = 1L, userId = 2L;
        User user = new User();
        user.setId(userId);

        Session session = new Session();
        session.setId(sessionId);
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(sessionRepository.save(session)).thenReturn(session);

        assertDoesNotThrow(() -> sessionService.participate(sessionId, userId));
        assertTrue(session.getUsers().contains(user));
    }

    @Test
    void testParticipateSessionNotFound() {
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(1L, 1L));
    }

    @Test
    void testParticipateUserAlreadyExists() {
        Long userId = 2L;
        User user = new User();
        user.setId(userId);

        Session session = new Session();
        session.setUsers(new ArrayList<>(List.of(user)));

        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(1L, userId));
    }

    @Test
    void testNoLongerParticipateSuccess() {
        Long userId = 2L;
        User user = new User();
        user.setId(userId);

        Session session = new Session();
        session.setUsers(new ArrayList<>(List.of(user)));

        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(1L, userId);
        assertFalse(session.getUsers().contains(user));
    }

    @Test
    void testNoLongerParticipateSessionNotFound() {
        when(sessionRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(1L, 2L));
    }

    @Test
    void testNoLongerParticipateUserNotParticipating() {
        Session session = new Session();
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(anyLong())).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(1L, 2L));
    }
}

