package com.educacidades.models.task.dto;

import com.educacidades.models.IMappable;
import com.educacidades.models.task.Task;
import com.educacidades.models.task.enums.EStatus;
import com.educacidades.models.user.dto.UserSummaryDTO;
import com.educacidades.models.default_task.enums.EPriority;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskDTO(
        Long id,
        String title,
        String description,
        EPriority priority,
        EStatus status,
        UserSummaryDTO responsible,
        LocalDateTime createdAt,
        Long defaultTaskId,
        LocalDate initialDate,
        LocalDate expectedEndDate,
        Integer setAsDefault,
        String link
) implements IMappable<Task> {
}