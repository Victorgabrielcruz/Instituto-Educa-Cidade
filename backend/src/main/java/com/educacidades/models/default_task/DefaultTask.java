package com.educacidades.models.default_task;


import com.educacidades.models.default_task.dto.DefaultTaskDTO;
import com.educacidades.models.default_task.enums.EPriority;
import com.educacidades.models.product.Product;
import com.educacidades.models.project_product.ProjectProduct;
import com.educacidades.models.task.Task;
import com.educacidades.models.task.enums.EStatus;
import com.educacidades.utils.ObjectMapperConfig;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "default_tasks")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DefaultTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "priority", nullable = false)
    @Enumerated(EnumType.STRING)
    private EPriority priority;

    @Column(name = "created_at", updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "product_id", updatable = false)
    @JsonIgnore
    private Product product;

    public DefaultTask(String title, String description, EPriority priority, Product product) {
        this.title = title;
        this.description = description;
        ;
        this.priority = priority;
        this.product = product;
    }

    public void setTitle(String title) {
        this.title = title.trim();
    }

    public void setDescription(String description) {
        this.description = description.trim();
    }

    public EPriority getPriority() {
        return EPriority.valueOf(priority.name());
    }

    public Task createTask(DefaultTask defaultTask, ProjectProduct projectProduct) {
        Task task = new Task();
        task.setTitle(defaultTask.getTitle());
        task.setDescription(defaultTask.getDescription());
        task.setPriority(defaultTask.getPriority());
        task.setProjectProduct(projectProduct);
        task.setTaskDefault(defaultTask);
        task.setStatus(EStatus.NAO_INICIADO);
        task.setResponsible(null);
        task.setInitialDate(projectProduct.getExpectedStart());
        task.setExpectedEndDate(projectProduct.getExpectedEnd());
        return task;
    }

    public DefaultTaskDTO toDTO() {
        return ObjectMapperConfig.OBJECT_MAPPER.convertValue(this, DefaultTaskDTO.class);
    }
}