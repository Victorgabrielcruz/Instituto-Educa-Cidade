package com.educacidades.models.project.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.educacidades.models.IMappable;
import com.educacidades.models.project.Project;
import com.educacidades.models.user.dto.UserDTO;

import jakarta.validation.constraints.NotBlank;

public record ProjectDTO(
    @NotBlank Long id, 
    String title, 
    String description, 
    String objective,
    String city, 
    String state, 
    String country,
    List<UserDTO> users,
    LocalDate expectedStart, 
    LocalDate expectedEnd,
    LocalDateTime createdAt) implements IMappable<Project> {
}