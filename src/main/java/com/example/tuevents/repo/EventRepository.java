package com.example.tuevents.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.tuevents.model.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
    // เพิ่มเมธอดค้นหาเพิ่มได้ เช่น Optional<Event> findByTitle(String title);
}