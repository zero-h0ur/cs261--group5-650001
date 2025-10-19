package com.example.tuevents.controller;

import com.example.tuevents.model.Category;
import com.example.tuevents.repo.CategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository repo;

    // ให้ Spring ฉีด repo ผ่าน constructor นี้
    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Category create(@RequestBody Category c) {
        return repo.save(c);
    }

    @GetMapping
    public List<Category> all() {
        return repo.findAll();
    }
}