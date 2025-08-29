package com.educacidades.models.user.dto;

import com.educacidades.models.IMappable;
import com.educacidades.models.user.User;
import com.educacidades.models.user.enums.ProfileEnum;

import java.time.LocalDateTime;
import java.util.Set;

public record UserDTO(
        Long id,
        String name,
        String email,
        Set<ProfileEnum> profiles,
        LocalDateTime createdAt) implements IMappable<User> {
}
