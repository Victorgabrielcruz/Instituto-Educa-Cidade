package com.educacidades.services;

import com.educacidades.models.default_task.DefaultTask;
import com.educacidades.models.product.Product;
import com.educacidades.repositories.DefaultTaskRepository;
import com.educacidades.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DefaultTaskService {

    @Autowired
    private DefaultTaskRepository defaultTaskRepository;

    @Transactional
    public void create(List<DefaultTask> defaultTask, Product product) {
        for (DefaultTask task : defaultTask) {
            task.setProduct(product);
        }
        product.setDefaultTasks(defaultTask);
        defaultTaskRepository.saveAll(defaultTask);
    }

    @Transactional
    public void associate(DefaultTask defaultTask, Product product) {
        defaultTask.setProduct(product);
        product.getDefaultTasks().add(defaultTask);
        defaultTaskRepository.save(defaultTask);
    }

    @Transactional
    public void update(Long id, DefaultTask defaultTask) {
        DefaultTask taskFound = defaultTaskRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Tarefa não encontrada."));

        taskFound.setTitle(defaultTask.getTitle());
        taskFound.setDescription(defaultTask.getDescription());
        taskFound.setPriority(defaultTask.getPriority());

        defaultTaskRepository.save(taskFound);
    }

    @Transactional
    public DefaultTask findById(Long id) {
        return defaultTaskRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Tarefa não encontrada."));
    }

    @Transactional
    public void delete(Long id) {
        DefaultTask taskFound = defaultTaskRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Tarefa não encontrada."));
        taskFound.getProduct().getDefaultTasks().remove(taskFound);
        defaultTaskRepository.delete(taskFound);
    }
}
