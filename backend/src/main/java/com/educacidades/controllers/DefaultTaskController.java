package com.educacidades.controllers;

import com.educacidades.models.default_task.DefaultTask;
import com.educacidades.models.default_task.dto.DefaultTaskCreateDTO;
import com.educacidades.models.default_task.dto.DefaultTaskUpdateDTO;
import com.educacidades.models.product.Product;
import com.educacidades.services.DefaultTaskService;
import com.educacidades.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/default-tasks")
@Validated
public class DefaultTaskController {

    @Autowired
    DefaultTaskService defaultTaskService;

    @Autowired
    ProductService productService;

    @PostMapping("/{productId}/associate")
    public ResponseEntity<Void> associate(@PathVariable Long productId, @Valid @RequestBody DefaultTaskCreateDTO defaultTaskCreateDTO) {
        DefaultTask defaultTask = defaultTaskCreateDTO.toEntity(DefaultTask.class);
        Product product = productService.findById(productId);
        defaultTaskService.associate(defaultTask, product);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @Valid @RequestBody DefaultTaskUpdateDTO defaultTaskUpdateDTO) {
        DefaultTask defaultTask = defaultTaskUpdateDTO.toEntity(DefaultTask.class);
        defaultTaskService.update(id, defaultTask);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        defaultTaskService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
