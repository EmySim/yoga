package com.openclassrooms.starterjwt.mappertest;

import com.openclassrooms.starterjwt.SpringBootSecurityJwtApplication;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@Tag("unit")
@SpringBootTest(classes = SpringBootSecurityJwtApplication.class)
class SessionMapperTest {

    @Autowired
    private SessionMapper sessionMapper;

    @MockBean
    private TeacherService teacherService;

    @MockBean
    private UserService userService;

    @Test
    void testToEntity() {
        // Arrange
        SessionDto sessionDto = new SessionDto();
        sessionDto.setDescription("Yoga Session");
        sessionDto.setTeacher_id(1L);
        sessionDto.setUsers(Arrays.asList(1L, 2L));

        Teacher mockTeacher = new Teacher();
        User mockUser1 = new User();
        User mockUser2 = new User();

        when(teacherService.findById(1L)).thenReturn(mockTeacher);
        when(userService.findById(1L)).thenReturn(mockUser1);
        when(userService.findById(2L)).thenReturn(mockUser2);

        // Act
        Session session = sessionMapper.toEntity(sessionDto);

        // Assert
        assertNotNull(session);
        assertEquals(sessionDto.getDescription(), session.getDescription());
        assertEquals(mockTeacher, session.getTeacher());
        assertEquals(2, session.getUsers().size());
        verify(teacherService, times(1)).findById(1L);
        verify(userService, times(2)).findById(anyLong());
    }

    @Test
    void testToDto() {
        // Arrange
        Session session = new Session();
        session.setDescription("Yoga Session");
        session.setTeacher(new Teacher());
        session.setUsers(Arrays.asList(new User(), new User()));

        // Act
        SessionDto sessionDto = sessionMapper.toDto(session);

        // Assert
        assertNotNull(sessionDto);
        assertEquals(session.getDescription(), sessionDto.getDescription());
        assertNotNull(sessionDto.getUsers());
        assertEquals(2, sessionDto.getUsers().size());
    }
}