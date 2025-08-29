package com.educacidades.models.project_product.dto;

import com.educacidades.models.default_task.enums.EPriority;
import com.educacidades.models.product.dto.ProductNoTasksDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ProjectProductDTO(
        Long id,
        ProductNoTasksDTO product,
        LocalDate expectedStart,
        LocalDate expectedEnd,
        LocalDateTime createdAt,
        EPriority priority
) {
} 
