package com.educacidades.models.default_task.dto;

import com.educacidades.models.IMappable;
import com.educacidades.models.default_task.DefaultTask;
import com.educacidades.models.default_task.enums.EPriority;

import java.time.LocalDateTime;

public record DefaultTaskDTO(
        Long id,
        String title,
        String description,
        EPriority priority,
        LocalDateTime createdAt) implements IMappable<DefaultTask> {
}
