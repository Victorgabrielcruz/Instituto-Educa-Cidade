package com.educacidades.models.project.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.educacidades.models.IMappable;
import com.educacidades.models.project.Project;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ProjectCreateDTO(
        @NotBlank String title,
        String description,
        String objective,
        String city,
        String state,
        String country,
        @NotNull List<Long> users,
        @NotNull LocalDate expectedStart,
        @NotNull LocalDate expectedEnd,
        LocalDateTime createdAt) implements IMappable<Project> {
} 
