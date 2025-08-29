package com.educacidades.models.project;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import com.educacidades.models.project_product.ProjectProduct;
import com.educacidades.models.user.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.educacidades.models.project.dto.ProjectDTO;

@Entity
@Table(name = "projects")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false)
    private Long id;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "objective", nullable = false)
    private String objective;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "state", nullable = false)
    private String state;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "expected_start", nullable = false)
    private LocalDate expectedStart;

    @Column(name = "expected_end", nullable = false)
    private LocalDate expectedEnd;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    private List<ProjectProduct> projectProducts = new LinkedList<>();

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "project_users", 
        joinColumns = @JoinColumn(name = "project_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> users = new LinkedList<>();

    public ProjectDTO toDTO() {
        return new ProjectDTO(
                id,
                title,
                description,
                objective,
                city,
                state,
                country,
                users.stream().map(User::toDTO).toList(),
                expectedStart,
                expectedEnd,
                createdAt
        );
    }
}
