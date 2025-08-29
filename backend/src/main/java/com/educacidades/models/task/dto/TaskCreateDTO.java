package com.educacidades.models.task.dto;

import java.time.LocalDate;

import com.educacidades.models.IMappable;
import com.educacidades.models.default_task.enums.EPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import com.educacidades.models.task.Task;

public record TaskCreateDTO(
        @NotBlank String title,
        @NotBlank String description,
        @NotNull EPriority priority,
        Long defaultTaskId,
        @NotNull Long projectProductId,
        LocalDate initialDate,
        LocalDate expectedEndDate,
        Long responsibleId,
        String link
) implements IMappable<Task> {
}