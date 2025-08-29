package com.educacidades.controllers;

import com.educacidades.models.default_task.DefaultTask;
import com.educacidades.models.product.Product;
import com.educacidades.models.product.dto.ProductCreateDTO;
import com.educacidades.models.product.dto.ProductDTO;
import com.educacidades.models.product.dto.ProductUpdateDTO;
import com.educacidades.services.DefaultTaskService;
import com.educacidades.services.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@Validated
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private DefaultTaskService defaultTaskService;

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody ProductCreateDTO productCreateDTO) {
        Product product = productCreateDTO.toEntity(Product.class);
        Product newProduct = productService.create(product);

        List<DefaultTask> defaultTasks = productCreateDTO.defaultTasks().stream().map(dto -> dto.toEntity(DefaultTask.class)).toList();
        defaultTaskService.create(defaultTasks, newProduct);

        URI uri = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(newProduct.getId()).toUri();

        return ResponseEntity.created(uri).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> update(@PathVariable Long id, @Valid @RequestBody ProductUpdateDTO productUpdateDTO) {
        Product product = productUpdateDTO.toEntity(Product.class);
        productService.update(id, product);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> findById(@PathVariable Long id) {
        Product productFound = productService.findById(id);
        return ResponseEntity.ok().body(productFound.toDTO());
    }

    @GetMapping("/by-code")
    public ResponseEntity<ProductDTO> findByCode(@RequestParam String code) {
        Product productFound = productService.findByCode(code);
        return ResponseEntity.ok().body(productFound.toDTO());
    }

    @GetMapping("/by-title")
    public ResponseEntity<List<ProductDTO>> findByTitle(@RequestParam String title) {
        List<Product> productsFounded = productService.findByTitle(title);
        return ResponseEntity.ok().body(productsFounded.stream().map(Product::toDTO).toList());
    }

    @GetMapping
    public ResponseEntity<List<ProductDTO>> findAll() {
        List<Product> products = productService.findAll();
        return ResponseEntity.ok().body(products.stream().map(Product::toDTO).toList());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
