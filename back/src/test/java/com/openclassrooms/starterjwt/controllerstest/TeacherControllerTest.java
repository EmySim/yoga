package com.openclassrooms.starterjwt.controllerstest;

import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
@Tag("unit")
@ExtendWith(MockitoExtension.class)
class TeacherControllerTest {

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherController teacherController;

    @Test
    void findById_should_return_teacherDto_when_teacher_exists() {
        // Given
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setLastName("Einstein");
        teacher.setFirstName("Albert");

        TeacherDto dto = new TeacherDto();
        dto.setId(1L);
        dto.setLastName("Einstein");
        dto.setFirstName("Albert");

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(dto);

        // When
        ResponseEntity<?> response = teacherController.findById("1");

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(dto, response.getBody());
    }

    @Test
    void findById_should_return_not_found_when_teacher_does_not_exist() {
        when(teacherService.findById(2L)).thenReturn(null);

        ResponseEntity<?> response = teacherController.findById("2");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void findById_should_return_bad_request_when_id_is_not_a_number() {
        ResponseEntity<?> response = teacherController.findById("abc");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }

    @Test
    void findAll_should_return_list_of_teacherDtos() {
        // Given
        Teacher t1 = new Teacher(); t1.setId(1L); t1.setFirstName("Marie"); t1.setLastName("Curie");
        Teacher t2 = new Teacher(); t2.setId(2L); t2.setFirstName("Isaac"); t2.setLastName("Newton");

        List<Teacher> teachers = Arrays.asList(t1, t2);

        TeacherDto dto1 = new TeacherDto(); dto1.setId(1L); dto1.setFirstName("Marie"); dto1.setLastName("Curie");
        TeacherDto dto2 = new TeacherDto(); dto2.setId(2L); dto2.setFirstName("Isaac"); dto2.setLastName("Newton");

        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(Arrays.asList(dto1, dto2));

        // When
        ResponseEntity<?> response = teacherController.findAll();

        // Then
        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<TeacherDto> result = (List<TeacherDto>) response.getBody();
        assertEquals(2, result.size());
        assertEquals("Curie", result.get(0).getLastName());
    }
}

