package com.educacidades.models.project_product;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.educacidades.models.default_task.enums.EPriority;
import com.educacidades.models.product.Product;
import com.educacidades.models.project_product.dto.ProjectProductDTO;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import com.educacidades.models.project.Project;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_products")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProjectProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "priority", nullable = false)
    @Enumerated(EnumType.STRING)
    private EPriority priority;

    @Column(name = "expected_start", nullable = false)
    private LocalDate expectedStart;

    @Column(name = "expected_end", nullable = false)
    private LocalDate expectedEnd;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public ProjectProductDTO toDTO() {
        return new ProjectProductDTO(id, product.productNoTasksDTO(), expectedStart, expectedEnd, createdAt, priority);
    }

}
