package com.educacidades.models.default_task.dto;

import com.educacidades.models.IMappable;
import com.educacidades.models.default_task.DefaultTask;
import com.educacidades.models.default_task.enums.EPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DefaultTaskCreateDTO(
        @NotBlank String title,
        String description,
        @NotNull EPriority priority) implements IMappable<DefaultTask> {
}
