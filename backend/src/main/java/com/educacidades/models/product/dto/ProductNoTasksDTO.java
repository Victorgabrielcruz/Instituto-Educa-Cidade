package com.educacidades.models.product.dto;

import com.educacidades.models.IMappable;
import com.educacidades.models.product.Product;

import java.time.LocalDateTime;

public record ProductNoTasksDTO(
        Long id,
        String code,
        String title,
        String description,
        LocalDateTime createdAt) implements IMappable<Product> {
}
