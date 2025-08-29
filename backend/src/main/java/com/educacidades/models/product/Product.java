package com.educacidades.models.product;

import com.educacidades.models.default_task.DefaultTask;
import com.educacidades.models.product.dto.ProductDTO;
import com.educacidades.models.product.dto.ProductNoTasksDTO;
import com.educacidades.models.project_product.ProjectProduct;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

@Entity
@Table(name = "products")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<DefaultTask> defaultTasks = new LinkedList<>();

    @OneToMany(mappedBy = "product")
    private List<ProjectProduct> projectProducts = new LinkedList<>();

    public void setCode(String code) {
        this.code = code.trim().toUpperCase();
    }

    public void setTitle(String title) {
        this.title = title.trim();
    }

    public void setDescription(String description) {
        this.description = description.trim();
    }

    public ProductDTO toDTO() {
        return new ProductDTO(
                id,
                code,
                title,
                description,
                defaultTasks.isEmpty() ? new LinkedList<>() : defaultTasks.stream().map(DefaultTask::toDTO).toList(),
                createdAt
        );
    }

    public ProductNoTasksDTO productNoTasksDTO() {
        return new ProductNoTasksDTO(
                id,
                code,
                title,
                description,
                createdAt
        );
    }
}
