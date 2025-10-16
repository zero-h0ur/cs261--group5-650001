package com.example.tuevents.controller;

import com.example.tuevents.model.Event;
import com.example.tuevents.service.EventService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService service;

    public EventController(EventService service) {
        this.service = service;
    }

    @GetMapping
    public List<Event> all() { return service.getAll(); }

    @PostMapping("/add")
    public Event add(@Valid @RequestBody Event e) { return service.create(e); }

    @PutMapping("/update/{id}")
    public Event update(@PathVariable Long id, @Valid @RequestBody Event e) {
        return service.update(id, e);
    }

    @DeleteMapping("/delete/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}