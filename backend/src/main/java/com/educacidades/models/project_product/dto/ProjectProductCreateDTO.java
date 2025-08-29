package com.educacidades.models.project_product.dto;

import com.educacidades.models.IMappable;
import com.educacidades.models.default_task.enums.EPriority;
import com.educacidades.models.project_product.ProjectProduct;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ProjectProductCreateDTO(
        @NotNull Long idProject,
        @NotNull Long idProduct,
        @NotNull LocalDate expectedStart,
        @NotNull LocalDate expectedEnd, 
        @NotNull EPriority priority) implements IMappable<ProjectProduct> {
}
