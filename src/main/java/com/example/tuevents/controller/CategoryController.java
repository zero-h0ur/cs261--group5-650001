package com.example.tuevents.controller;

import com.example.tuevents.model.Category;
import com.example.tuevents.repo.CategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public Object create(@RequestBody Object body) {
        if (body instanceof List<?>) {
            // กรณีเป็น array
            List<?> items = (List<?>) body;
            List<Category> saved = new ArrayList<>();
            for (Object obj : items) {
                if (obj instanceof Map<?, ?> map) {
                    Object nameObj = map.get("category_name");
                    if (nameObj instanceof String name && !name.isBlank()) {
                        saved.add(repo.save(new Category(name)));
                    }
                }
            }
            return saved;
        } else if (body instanceof Map<?, ?> map) {
            // กรณีเป็น object เดียว
            Object nameObj = map.get("category_name");
            if (nameObj instanceof String name && !name.isBlank()) {
                return repo.save(new Category(name));
            }
        }
        return null;
    }

    @GetMapping
    public List<Category> all() {
        return repo.findAll();
    }
}
