package com.example.tuevents.service;

import com.example.tuevents.model.Event;
import com.example.tuevents.repo.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    private final EventRepository repo;

    public EventService(EventRepository repo) {
        this.repo = repo;
    }

    public List<Event> getAll() { return repo.findAll(); }
    public Event create(Event e) { return repo.save(e); }
    public Event update(Long id, Event e) { e.setId(id); return repo.save(e); }
    public void delete(Long id) { repo.deleteById(id); }
}

