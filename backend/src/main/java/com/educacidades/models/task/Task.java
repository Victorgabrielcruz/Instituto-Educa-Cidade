package com.educacidades.models.task;

import com.educacidades.models.project_product.ProjectProduct;
import com.educacidades.models.task.dto.TaskDTO;
import com.educacidades.models.user.User;
import com.educacidades.models.default_task.enums.EPriority;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.educacidades.models.default_task.DefaultTask;
import com.educacidades.models.product.Product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.educacidades.models.task.enums.EStatus;


@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {

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

    @Column(name = "status", nullable = false)
    private EStatus status;

    @Column(name = "link", nullable = true)
    private String link;

    @ManyToOne
    @JoinColumn(name = "responsible_id", nullable = true)
    private User responsible;

    @Column(name = "created_at", updatable = false, nullable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "task_default_id", nullable = true)
    private DefaultTask taskDefault;

    @ManyToOne
    @JoinColumn(name = "project_product_id", updatable = false)
    @JsonIgnore
    private ProjectProduct projectProduct;

    @Column(name = "initial_date", nullable = false)
    private LocalDate initialDate;

    @Column(name = "expected_end_date", nullable = false)
    private LocalDate expectedEndDate;

    @Column(name = "started_in", nullable = true)
    private LocalDateTime startedIn;

    @Column(name = "finished_in", nullable = true)
    private LocalDateTime finishedIn;

    @Column(name = "duration", nullable = true)
    private Long duration;

    @Column(name = "set_as_default", nullable = true)
    private Integer setAsDefault;

    public void setTitle(String title) {
        this.title = title.trim();
    }

    public void setDescription(String description) {
        this.description = description.trim();
    }

    public void setStatus(EStatus status) {
        this.status = status;
    }

    public TaskDTO toDTO() {
        return new TaskDTO(id, title, description, priority, status, responsible != null ? responsible.toSummaryDTO() : null, createdAt, this.taskDefault != null ? taskDefault.getId() : null, initialDate, expectedEndDate, setAsDefault, link);
    }

    public Product getProduct() {
        return this.projectProduct.getProduct();
    }

    public Long getProductId() {
        return this.projectProduct.getProduct().getId();
    }

    public Long getDefaultTaskID() {
        return this.taskDefault != null ? this.taskDefault.getId() : null;
    }
}