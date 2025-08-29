package com.educacidades.controllers;

import com.educacidades.models.project.dto.ProjectDTO;
import com.educacidades.models.project.dto.ProjectUpdateDTO;
import com.educacidades.models.user.User;
import com.educacidades.models.user.dto.UserSummaryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.educacidades.models.project.Project;
import com.educacidades.models.project.dto.ProjectCreateDTO;
import com.educacidades.services.ProjectService;
import com.educacidades.services.UserService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


@RestController
@RequestMapping("/api/v1/projects")
@Validated
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @PostMapping()
    public ResponseEntity<Void> create(@Valid @RequestBody ProjectCreateDTO projectCreateDTO) {
        Project project = projectCreateDTO.toEntity(Project.class);
        List<User> users = projectCreateDTO.users().stream().map(x -> userService.findById(x, true)).collect(Collectors.toList());
        project.setUsers(users);

        Project newProject = projectService.create(project);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newProject.getId()).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @Valid @RequestBody ProjectUpdateDTO projectUpdateDTO) {
        Project project = projectUpdateDTO.toEntity(Project.class);
        List<User> users = projectUpdateDTO.users().stream().map(x -> userService.findById(x, true)).collect(Collectors.toList());
        project.setUsers(users);

        projectService.update(id, project);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/by-title")
    public ResponseEntity<List<ProjectDTO>> findByTitle(@RequestParam String title) {
        List<Project> projectsFounded = projectService.findByTitle(title);
        return ResponseEntity.ok().body(projectsFounded.stream().map(Project::toDTO).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> findById(@PathVariable Long id) {
        Project projectFound = projectService.findById(id);
        return ResponseEntity.ok().body(projectFound.toDTO());
    }

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> findAll() {
        List<Project> projects = projectService.findAll();
        return ResponseEntity.ok().body(projects.stream().map(Project::toDTO).toList());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/users")
    public ResponseEntity<List<UserSummaryDTO>> findAllUsers(@PathVariable Long id) {
        List<User> users = projectService.findAllUsers(id);
        return ResponseEntity.ok().body(users.stream().map(User::toSummaryDTO).toList());
    }
}
