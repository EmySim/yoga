package com.openclassrooms.starterjwt.mappertest;

import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapperImpl;
import com.openclassrooms.starterjwt.models.Teacher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
@Tag("unit")
class TeacherMapperTest {

    private TeacherMapperImpl teacherMapper;

    @BeforeEach
    void setUp() {
        teacherMapper = new TeacherMapperImpl();
    }

    @Test
    void toEntity_should_return_null_when_dto_is_null() {
        assertNull(teacherMapper.toEntity((TeacherDto) null), "La méthode toEntity devrait retourner null si l'entrée est null.");
    }

    @Test
    void toEntity_should_map_fields_correctly() {
        LocalDateTime fixedDateTime = LocalDateTime.of(2023, 1, 1, 0, 0);
        TeacherDto dto = new TeacherDto();
        dto.setId(1L);
        dto.setFirstName("Ada");
        dto.setLastName("Lovelace");
        dto.setCreatedAt(fixedDateTime);
        dto.setUpdatedAt(fixedDateTime);

        Teacher entity = teacherMapper.toEntity(dto);

        assertNotNull(entity, "L'entité ne devrait pas être null.");
        assertEquals(dto.getId(), entity.getId(), "L'ID devrait être correctement mappé.");
        assertEquals(dto.getFirstName(), entity.getFirstName(), "Le prénom devrait être correctement mappé.");
        assertEquals(dto.getLastName(), entity.getLastName(), "Le nom de famille devrait être correctement mappé.");
        assertEquals(dto.getCreatedAt(), entity.getCreatedAt(), "La date de création devrait être correctement mappée.");
        assertEquals(dto.getUpdatedAt(), entity.getUpdatedAt(), "La date de mise à jour devrait être correctement mappée.");
    }

    @Test
    void toDto_should_return_null_when_entity_is_null() {
        assertNull(teacherMapper.toDto((Teacher) null), "La méthode toDto devrait retourner null si l'entrée est null.");
    }

    @Test
    void toDto_should_map_fields_correctly() {
        LocalDateTime fixedDateTime = LocalDateTime.of(2023, 1, 1, 0, 0);
        Teacher entity = Teacher.builder()
                .id(2L)
                .firstName("Grace")
                .lastName("Hopper")
                .createdAt(fixedDateTime)
                .updatedAt(fixedDateTime)
                .build();

        TeacherDto dto = teacherMapper.toDto(entity);

        assertNotNull(dto, "Le DTO ne devrait pas être null.");
        assertEquals(entity.getId(), dto.getId(), "L'ID devrait être correctement mappé.");
        assertEquals(entity.getFirstName(), dto.getFirstName(), "Le prénom devrait être correctement mappé.");
        assertEquals(entity.getLastName(), dto.getLastName(), "Le nom de famille devrait être correctement mappé.");
        assertEquals(entity.getCreatedAt(), dto.getCreatedAt(), "La date de création devrait être correctement mappée.");
        assertEquals(entity.getUpdatedAt(), dto.getUpdatedAt(), "La date de mise à jour devrait être correctement mappée.");
    }

    @Test
    void toEntityList_should_return_empty_list_when_input_is_empty() {
        List<Teacher> list = teacherMapper.toEntity(Collections.emptyList());
        assertNotNull(list, "La liste ne devrait pas être null.");
        assertTrue(list.isEmpty(), "La liste devrait être vide.");
    }

    @Test
    void toEntityList_should_map_list_correctly() {
        TeacherDto dto = new TeacherDto();
        dto.setId(3L);
        dto.setFirstName("Marie");
        dto.setLastName("Curie");

        List<Teacher> list = teacherMapper.toEntity(List.of(dto));

        assertNotNull(list, "La liste ne devrait pas être null.");
        assertEquals(1, list.size(), "La liste devrait contenir un élément.");
        assertEquals("Marie", list.get(0).getFirstName(), "Le prénom devrait être correctement mappé.");
    }

    @Test
    void toDtoList_should_return_empty_list_when_input_is_empty() {
        List<TeacherDto> list = teacherMapper.toDto(Collections.emptyList());
        assertNotNull(list, "La liste ne devrait pas être null.");
        assertTrue(list.isEmpty(), "La liste devrait être vide.");
    }

    @Test
    void toDtoList_should_map_list_correctly() {
        Teacher entity = Teacher.builder()
                .id(4L)
                .firstName("Alan")
                .lastName("Turing")
                .build();

        List<TeacherDto> list = teacherMapper.toDto(List.of(entity));

        assertNotNull(list, "La liste ne devrait pas être null.");
        assertEquals(1, list.size(), "La liste devrait contenir un élément.");
        assertEquals("Alan", list.get(0).getFirstName(), "Le prénom devrait être correctement mappé.");
    }
}