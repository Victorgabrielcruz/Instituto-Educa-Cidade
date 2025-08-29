package com.educacidades.models.product.dto;

import com.educacidades.models.IMappable;
import com.educacidades.models.default_task.dto.DefaultTaskDTO;
import com.educacidades.models.product.Product;

import java.time.LocalDateTime;
import java.util.List;

public record ProductDTO(
        Long id,
        String code,
        String title,
        String description,
        List<DefaultTaskDTO> defaultTasks,
        LocalDateTime createdAt) implements IMappable<Product> {
}
