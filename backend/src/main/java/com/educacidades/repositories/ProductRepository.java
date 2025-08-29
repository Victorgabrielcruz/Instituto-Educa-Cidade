package com.educacidades.repositories;

import com.educacidades.models.product.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByCodeIgnoreCase(@Param("code") String code);

    List<Product> findByTitleIgnoreCaseContaining(@Param("title") String title);
}
