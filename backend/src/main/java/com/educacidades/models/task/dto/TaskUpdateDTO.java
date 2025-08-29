package com.educacidades.models.task.dto;

import java.time.LocalDate;

import com.educacidades.models.IMappable;
import com.educacidades.models.task.Task;
import com.educacidades.models.task.enums.EStatus;
import com.educacidades.models.default_task.enums.EPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TaskUpdateDTO(
        @NotBlank String title,
        String description,
        Long responsibleId,
        @NotNull EPriority priority,
        @NotNull EStatus status,        
        LocalDate initialDate,
        LocalDate expectedEndDate,
        String link
) implements IMappable<Task> {
}