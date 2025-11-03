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
    
    //Method To Select Camel Or Snake (Commit #)
    private String getName(Map<?, ?> map) {
        Object v = map.get("categoryName");
        if (v == null) v = map.get("category_name");
        return (v instanceof String s && !s.isBlank()) ? s : null;
    }

    @PostMapping
    public Object create(@RequestBody Object body) {
        if (body instanceof List<?> items) {
            List<Category> saved = new ArrayList<>();
            for (Object obj : items) {
                if (obj instanceof Map<?, ?> map) {
                    String name = getName(map);
                    if (name != null) saved.add(repo.save(new Category(name)));
                }
            }
            return saved;
        } else if (body instanceof Map<?, ?> map) {
            String name = getName(map);
            if (name != null) return repo.save(new Category(name));
        }
        return null;
    }

    @GetMapping
    public List<Category> all() {
        return repo.findAll();
    }
}
