package com.educacidades.services;

import com.educacidades.models.default_task.DefaultTask;
import com.educacidades.models.task.Task;
import com.educacidades.models.task.enums.EStatus;
import com.educacidades.repositories.TaskRepository;
import com.educacidades.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;


@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private DefaultTaskService defaultTaskService;

    @Transactional
    public Task create(Task task) {
        return taskRepository.save(task);
    }

    @Transactional
    public void update(Long id, Task task) {
        Task taskFound = taskRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Tarefa não encontrada."));

        taskFound.setTitle(task.getTitle());
        taskFound.setDescription(task.getDescription());
        taskFound.setPriority(task.getPriority());
        taskFound.setStatus(task.getStatus());
        taskFound.setResponsible(task.getResponsible());
        taskFound.setInitialDate(task.getInitialDate());
        taskFound.setExpectedEndDate(task.getExpectedEndDate());
        taskFound.setLink(task.getLink());

        if (taskFound.getStartedIn() != null && task.getStatus().equals(EStatus.NAO_INICIADO))
            taskFound.setStartedIn(null);

        if (!task.getStatus().equals(EStatus.CONCLUIDO) && taskFound.getFinishedIn() != null) {
            taskFound.setFinishedIn(null);
            taskFound.setDuration(null);
        }

        if (task.getStatus().equals(EStatus.EM_ANDAMENTO) && taskFound.getStartedIn() == null)
            taskFound.setStartedIn(LocalDateTime.now());

        if (task.getStatus().equals(EStatus.CONCLUIDO) && taskFound.getFinishedIn() == null)
            taskFound.setFinishedIn(LocalDateTime.now());

        if (taskFound.getDuration() == null && taskFound.getInitialDate() != null && taskFound.getFinishedIn() != null) {
            Duration duration = Duration.between(taskFound.getStartedIn(), taskFound.getFinishedIn());
            taskFound.setDuration(duration.getSeconds());
        }

        taskRepository.save(taskFound);
    }

    @Transactional
    public void delete(Long id) {
        Task taskFound = this.findById(id);
        taskRepository.delete(taskFound);
    }
    
    @Transactional
    public Task findById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Tarefa não encontrada."));
    }

    public Task removeResponsible(Long id) {
        Task taskFound = taskRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Tarefa não encontrada."));
        taskFound.setResponsible(null);
        return taskRepository.save(taskFound);
    }

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    @Transactional
    public List<Task> findAllByProjectProductId(Long projectProductId) {
        return taskRepository.findAllByProjectProductId(projectProductId);
    }

    @Transactional
    public void setAsDefault(Long id) {
        Task task = this.findById(id);
        DefaultTask defaultTask = new DefaultTask(task.getTitle(), task.getDescription(), task.getPriority(), task.getProduct());
        defaultTaskService.associate(defaultTask, defaultTask.getProduct());
        task.setSetAsDefault(1);
        taskRepository.save(task);
    }
}