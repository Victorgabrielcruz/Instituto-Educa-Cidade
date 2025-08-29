package com.educacidades.models.product.dto;

import com.educacidades.models.IMappable;
import com.educacidades.models.product.Product;
import jakarta.validation.constraints.NotBlank;

public record ProductUpdateDTO(
        @NotBlank String code,
        @NotBlank String title,
        String description) implements IMappable<Product> {
}
