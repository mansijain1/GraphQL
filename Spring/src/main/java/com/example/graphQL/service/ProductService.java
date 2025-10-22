package com.example.graphQL.service;

import com.example.graphQL.entity.Product;
import com.example.graphQL.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepository repository;

    public List<Product> getProducts(){
        return repository.findAll();
    }

    public List<Product> getProductsByCategory(String category){
        return repository.findByCategory(category);
    }

    public Product updateStock(int id, int stock){

        Product existingProduct= repository.findById(id)
                .orElseThrow(()-> new RuntimeException("product not found with id "+id));

        System.out.println("Updating product ID: " + id);
        System.out.println("Old stock: " + existingProduct.getStock());
        existingProduct.setStock(stock);
        System.out.println("New stock: " + existingProduct.getStock());

        Product saved = repository.save(existingProduct);
        System.out.println("Saved product: " + saved);
        return saved;
    }

    public Product receiveNewShipment(int id, int quantity){

        Product existingProduct= repository.findById(id)
                .orElseThrow(()-> new RuntimeException("product not found with id "+id));

        existingProduct.setStock(existingProduct.getStock()+quantity);
        return repository.save(existingProduct);
    }
}

