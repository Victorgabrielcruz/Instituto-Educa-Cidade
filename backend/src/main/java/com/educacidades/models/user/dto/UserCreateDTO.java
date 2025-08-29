package com.educacidades.models.user.dto;

import com.educacidades.models.IMappable;
import com.educacidades.models.user.User;
import com.educacidades.models.user.enums.ProfileEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Set;

public record UserCreateDTO(
        @NotBlank String name,
        @NotBlank String email,
        @NotBlank String password,
        Set<@NotNull ProfileEnum> profiles) implements IMappable<User> {
}
