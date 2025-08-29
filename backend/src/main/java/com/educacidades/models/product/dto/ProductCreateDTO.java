package com.educacidades.models.product.dto;

import com.educacidades.models.IMappable;
import com.educacidades.models.default_task.dto.DefaultTaskCreateDTO;
import com.educacidades.models.product.Product;
import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ProductCreateDTO(
        @NotBlank String code,
        @NotBlank String title,
        String description,
        List<DefaultTaskCreateDTO> defaultTasks) implements IMappable<Product> {
}
