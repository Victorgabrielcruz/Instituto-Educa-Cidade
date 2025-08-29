package com.educacidades.services;

import com.educacidades.models.default_task.DefaultTask;
import com.educacidades.models.default_task.enums.EPriority;
import com.educacidades.models.project_product.ProjectProduct;
import com.educacidades.models.task.Task;
import com.educacidades.repositories.ProjectProductRepository;
import com.educacidades.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectProductService {

    @Autowired
    private ProjectProductRepository projectProductRepository;

    @Autowired
    private TaskService taskService;

    @Transactional
    public void add(ProjectProduct projectProduct) {
        boolean exists = projectProductRepository.existsByProjectIdAndProductId(
                projectProduct.getProject().getId(),
                projectProduct.getProduct().getId()
        );

        if (exists) {
            throw new DataIntegrityViolationException("Produto já existe neste projeto.");
        }

        projectProductRepository.save(projectProduct);
        List<DefaultTask> defaultTasks = projectProduct.getProduct().getDefaultTasks();

        for (DefaultTask defaultTask : defaultTasks) {
            Task task = defaultTask.createTask(defaultTask, projectProduct);
            taskService.create(task);
        }
    }

    @Transactional
    public List<ProjectProduct> findByPriority(EPriority priority) {
        return projectProductRepository.findByPriority(priority);
    }

    @Transactional
    public List<ProjectProduct> findAllProductsByProjectId(Long id) {
        return projectProductRepository.findProjectProductsByProjectId(id);
    }

    @Transactional
    public void remove(Long idProduct) {
        projectProductRepository.deleteById(idProduct);
    }

    @Transactional
    public ProjectProduct findById(Long id) {
        return projectProductRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Produto não encontrado"));
    }
}
