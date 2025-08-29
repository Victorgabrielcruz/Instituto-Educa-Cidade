package com.educacidades.repositories;

import java.util.List;
import java.util.Optional;

import com.educacidades.models.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import com.educacidades.models.project.Project;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByTitleIgnoreCaseContaining(String title);

    List<Project> findByUsersId(Long id);

    Optional<Project> findByIdAndUsersId(Long projectId, Long userId);

    @Query("SELECT p.users FROM Project p WHERE p.id = :projectId")
    List<User> findAllUsersByProjectId(@Param("projectId") Long projectId);
}
