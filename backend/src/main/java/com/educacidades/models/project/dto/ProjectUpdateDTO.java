package com.educacidades.models.project.dto;

import java.time.LocalDate;
import java.util.List;

import com.educacidades.models.IMappable;
import com.educacidades.models.project.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProjectUpdateDTO(
        @NotBlank String title,
        String description,
        String objective,
        String city,
        String state,
        String country,
        @NotNull List<Long> users,
        @NotNull LocalDate expectedStart,
        @NotNull LocalDate expectedEnd) implements IMappable<Project> {
}