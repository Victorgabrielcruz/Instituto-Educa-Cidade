package com.educacidades.repositories;

import com.educacidades.models.default_task.enums.EPriority;
import com.educacidades.models.project_product.ProjectProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectProductRepository extends JpaRepository<ProjectProduct, Long> {
    boolean existsByProjectIdAndProductId(Long projectId, Long productId);

    List<ProjectProduct> findProjectProductsByProjectId(Long id);
    List<ProjectProduct> findByPriority(EPriority priority);
}
