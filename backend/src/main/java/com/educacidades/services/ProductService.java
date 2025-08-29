package com.educacidades.services;

import com.educacidades.models.product.Product;
import com.educacidades.repositories.ProductRepository;
import com.educacidades.services.exceptions.ObjectNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Product create(Product product) {
        try {
            return productRepository.save(product);
        } catch (DataIntegrityViolationException exception) {
            throw new DataIntegrityViolationException("Já existe um produto cadastrado com o código informado.");
        }
    }

    @Transactional
    public Product update(Long id, Product product) {
        Product productFound = productRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Produto não encontrado."));

        productFound.setCode(product.getCode());
        productFound.setTitle(product.getTitle());
        productFound.setDescription(product.getDescription());

        return productRepository.save(productFound);
    }

    @Transactional
    public Product findById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new ObjectNotFoundException("Produto não encontrado."));
    }

    @Transactional
    public Product findByCode(String code) {
        return productRepository.findByCodeIgnoreCase(code).orElseThrow(() -> new ObjectNotFoundException("Produto não encontrado."));
    }

    @Transactional
    public List<Product> findByTitle(String title) {
        return productRepository.findByTitleIgnoreCaseContaining(title);
    }

    @Transactional
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Transactional
    public void delete(Long id) {
        Product productFound = findById(id);
        productRepository.delete(productFound);
    }
}
