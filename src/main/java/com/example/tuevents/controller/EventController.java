package com.example.tuevents.controller;

import com.example.tuevents.model.Event;
import com.example.tuevents.service.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService service;
    public EventController(EventService service) { this.service = service; }

    @GetMapping
    public Page<Event> getAll(
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer limit,
            @RequestParam(defaultValue = "eventId") String sort,
            @RequestParam(defaultValue = "desc") String dir,
            @RequestParam(value = "category", required = false) List<Long> category
    ) {
        return service.getAll(page, limit, sort, dir, category);
    }

    @GetMapping(params = "search")
    public Page<Event> search(@RequestParam String search,
                              @PageableDefault(size = 12, sort = "eventId") Pageable pageable) {
        return service.search(search, pageable);
    }

    @GetMapping("/{id}")
    public EventDetailDTO getOne(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/range")
    public Page<Event> findByRange(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @PageableDefault(size = 12, sort = "startDate") Pageable pageable) {
        return service.findByDateRange(start, end, pageable);
    }

    @GetMapping(params = "start")
    public Page<Event> byRange(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @PageableDefault(size = 12, sort = "startDate") Pageable pageable) {
        return service.findByDateRange(start, end, pageable);
    }

    // <<<<<< ADD EVENT HERE >>>>>>
    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    public EventDetailDTO add(@Valid @RequestBody CreateEventRequest req) {
        return service.create(req);
    }

    // (ออปชัน) endpoint ผสม filter
    @GetMapping("/filter")
    public Page<Event> filter(
            @RequestParam(required = false) String categories,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end,
            @PageableDefault(size = 12, sort = "eventId") Pageable pageable) {
        return service.filter(categories, search, start, end, pageable);
    }
}
