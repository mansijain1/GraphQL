package com.example.graphQL.repository;

import com.example.graphQL.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product,Integer > {
    List<Product> findByCategory(String category);
}
