package com.educacidades.controllers;

import com.educacidades.models.default_task.DefaultTask;
import com.educacidades.models.project_product.ProjectProduct;
import com.educacidades.models.task.Task;
import com.educacidades.models.task.dto.TaskUpdateDTO;
import com.educacidades.models.task.enums.EStatus;
import com.educacidades.models.user.User;
import com.educacidades.services.DefaultTaskService;
import com.educacidades.services.ProjectProductService;
import com.educacidades.services.TaskService;
import com.educacidades.services.UserService;
import com.educacidades.models.task.dto.TaskCreateDTO;
import com.educacidades.models.task.dto.TaskDTO;
import com.educacidades.services.exceptions.ObjectNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/v1/tasks")
@Validated
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private DefaultTaskService defaultTaskService;

    @Autowired
    private ProjectProductService projectProductService;

    @Autowired
    private UserService userService;

    @PostMapping()
    public ResponseEntity<Void> create(@Valid @RequestBody TaskCreateDTO taskDTO) {
        ProjectProduct projectProduct = projectProductService.findById(taskDTO.projectProductId());
        DefaultTask defaultTask = null;

        User responsible = taskDTO.responsibleId() != null ? userService.findById(taskDTO.responsibleId(), true) : null;

        try {
            defaultTask = defaultTaskService.findById(taskDTO.defaultTaskId());
        } catch (ObjectNotFoundException onfe) {

        }

        Task task = new Task();
        task.setTitle(taskDTO.title());
        task.setDescription(taskDTO.description());
        task.setStatus(EStatus.NAO_INICIADO);
        task.setPriority(taskDTO.priority());
        task.setResponsible(responsible);
        task.setTaskDefault(defaultTask);
        task.setInitialDate(taskDTO.initialDate());
        task.setLink(taskDTO.link());
        task.setExpectedEndDate(taskDTO.expectedEndDate());
        task.setProjectProduct(projectProduct);

        taskService.create(task);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @Valid @RequestBody TaskUpdateDTO taskUpdateDTO) {
        Task task = new Task();
        User responsible = userService.findById(taskUpdateDTO.responsibleId(), true);
        task.setTitle(taskUpdateDTO.title());
        task.setDescription(taskUpdateDTO.description());
        task.setPriority(taskUpdateDTO.priority());
        task.setStatus(taskUpdateDTO.status());
        task.setResponsible(responsible);
        task.setInitialDate(taskUpdateDTO.initialDate());
        task.setExpectedEndDate(taskUpdateDTO.expectedEndDate());
        task.setLink(taskUpdateDTO.link());
        
        taskService.update(id, task);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> findById(@PathVariable Long id) {
        Task task = taskService.findById(id);
        return ResponseEntity.ok(task.toDTO());
    }

    @GetMapping
    public ResponseEntity<List<TaskDTO>> findAll() {
        List<Task> tasks = taskService.findAll();
        List<TaskDTO> taskDTOs = tasks.stream().map(Task::toDTO).toList();
        return ResponseEntity.ok(taskDTOs);
    }

    @GetMapping("/project-product/{projectProductId}")
    public ResponseEntity<List<TaskDTO>> findAllByProjectProductId(@PathVariable Long projectProductId) {
        List<Task> tasks = taskService.findAllByProjectProductId(projectProductId);
        List<TaskDTO> taskDTOs = tasks.stream().map(Task::toDTO).toList();
        return ResponseEntity.ok(taskDTOs);
    }

    @PostMapping("set-as-default/{id}")
    public ResponseEntity<Void> setAsDefault(@PathVariable Long id) {
        taskService.setAsDefault(id);
        return ResponseEntity.noContent().build();
    }
}