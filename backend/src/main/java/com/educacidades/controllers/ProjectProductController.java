package com.educacidades.controllers;

import com.educacidades.models.product.Product;
import com.educacidades.models.project.Project;
import com.educacidades.models.project_product.ProjectProduct;
import com.educacidades.models.project_product.dto.ProjectProductCreateDTO;
import com.educacidades.models.project_product.dto.ProjectProductDTO;
import com.educacidades.services.ProductService;
import com.educacidades.services.ProjectProductService;
import com.educacidades.services.ProjectService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects-products")
@Validated
public class ProjectProductController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ProjectProductService projectProductService;

    @PostMapping()
    public ResponseEntity<Void> create(@Valid @RequestBody ProjectProductCreateDTO projectProductCreateDTO) {
        Project project = projectService.findById(projectProductCreateDTO.idProject());
        Product product = productService.findById(projectProductCreateDTO.idProduct());

        ProjectProduct projectProduct = new ProjectProduct();
        projectProduct.setProduct(product);
        projectProduct.setProject(project);
        projectProduct.setExpectedStart(projectProductCreateDTO.expectedStart());
        projectProduct.setExpectedEnd(projectProductCreateDTO.expectedEnd());
        projectProduct.setPriority(projectProductCreateDTO.priority());
        projectProductService.add(projectProduct);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectProductDTO> findById(@PathVariable Long id) {
        ProjectProduct projectProduct = projectProductService.findById(id);
        return ResponseEntity.ok().body(projectProduct.toDTO());
    }

    @GetMapping("/project/{id}/products")
    public ResponseEntity<List<ProjectProductDTO>> findAllProductsByProjectId(@PathVariable Long id) {
        List<ProjectProduct> products = projectProductService.findAllProductsByProjectId(id);
        return ResponseEntity.ok().body(products.stream().map(ProjectProduct::toDTO).toList());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        projectProductService.remove(id);
        return ResponseEntity.noContent().build();
    }
}
