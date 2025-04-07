package com.openclassrooms.starterjwt.mappertest;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapperImpl;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class UserMapperTest {

    private UserMapper userMapper;

    @BeforeEach
    public void setUp() {
        // Initialisation du Mapper sans utiliser Spring (par défaut MapStruct génère des implémentations)
        userMapper = new UserMapperImpl();  // MapStruct génère la classe d'implémentation automatiquement
    }

    @Test
    public void testToUserDto() {
        // Créer un utilisateur pour tester le mapping
        User user = new User();
        user.setId(1L);
        user.setEmail("jane.doe@example.com");
        user.setFirstName("Jane");
        user.setLastName("Doe");
        user.setPassword("password");
        user.setAdmin(true);

        // Mapper l'utilisateur vers un UserDto
        UserDto userDto = userMapper.toDto(user);

        // Vérifier que la conversion a bien eu lieu
        assertEquals(user.getId(), userDto.getId());
        assertEquals(user.getEmail(), userDto.getEmail());
        assertEquals(user.getFirstName(), userDto.getFirstName());
        assertEquals(user.getLastName(), userDto.getLastName());
    }

    @Test
    public void testToUser() {
        // Créer un UserDto pour tester le reverse mapping
        UserDto userDto = new UserDto();
        userDto.setId(1L);
        userDto.setEmail("jane.doe@example.com");
        userDto.setFirstName("Jane");
        userDto.setLastName("Doe");
        userDto.setPassword("password");
        userDto.setAdmin(true);

        // Mapper le UserDto vers un User
        User user = userMapper.toEntity(userDto);

        // Vérifier que la conversion a bien eu lieu
        assertEquals(userDto.getId(), user.getId());
        assertEquals(userDto.getEmail(), user.getEmail());
        assertEquals(userDto.getFirstName(), user.getFirstName());
        assertEquals(userDto.getLastName(), user.getLastName());
    }
}