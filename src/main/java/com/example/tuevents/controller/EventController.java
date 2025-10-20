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

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JdbcTemplate jdbc; // ✅ ใช้รัน SQL ฝั่ง DB แบบไม่ต้องมี GO

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
    public EventDetailDTO getOne(@PathVariable String id) {
        return service.getPublicById(id);
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
    // ✅ ให้ /add รองรับทั้ง object เดียวหรือ array และ “จัด schema active ให้เรียบร้อยก่อน” โดยไม่ต้องแตะ DB ด้วยมือ
    @PostMapping("/add")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public Object add(@Valid @RequestBody JsonNode body) {
        ensureEventActiveColumn(); // ✅ ทำให้แน่ใจว่ามีคอลัมน์ active + DEFAULT(1) แล้ว

        if (body.isArray()) {
            List<CreateEventRequest> list = objectMapper.convertValue(
                    body,
                    objectMapper.getTypeFactory().constructCollectionType(List.class, CreateEventRequest.class)
            );
            // ใช้ Collectors.toList() ให้ชัวร์กับ JDK8
            return list.stream().map(service::create).collect(Collectors.toList());
        } else {
            CreateEventRequest req = objectMapper.convertValue(body, CreateEventRequest.class);
            return service.create(req);
        }
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

    // ------------------ helper: จัดการคอลัมน์ active แบบ idempotent ------------------
    private void ensureEventActiveColumn() {
        final String sql = """
            IF COL_LENGTH('dbo.[event]', 'active') IS NULL
            BEGIN
                ALTER TABLE dbo.[event] ADD active BIT NULL;
                UPDATE dbo.[event] SET active = 1 WHERE active IS NULL;

                -- กันชื่อ constraint ชน (ถ้าเคยมี)
                IF EXISTS (
                   SELECT 1 FROM sys.default_constraints
                   WHERE name = 'DF_event_active'
                     AND parent_object_id = OBJECT_ID('dbo.[event]')
                )
                BEGIN
                   ALTER TABLE dbo.[event] DROP CONSTRAINT DF_event_active;
                END

                ALTER TABLE dbo.[event] ADD CONSTRAINT DF_event_active DEFAULT (1) FOR active;
                ALTER TABLE dbo.[event] ALTER COLUMN active BIT NOT NULL;
            END
            ELSE
            BEGIN
                UPDATE dbo.[event] SET active = 1 WHERE active IS NULL;

                IF NOT EXISTS (
                   SELECT 1
                   FROM sys.default_constraints dc
                   JOIN sys.columns c
                     ON dc.parent_object_id = c.object_id
                    AND dc.parent_column_id = c.column_id
                   WHERE dc.parent_object_id = OBJECT_ID('dbo.[event]')
                     AND c.name = 'active'
                )
                BEGIN
                    ALTER TABLE dbo.[event] ADD CONSTRAINT DF_event_active DEFAULT (1) FOR active;
                END

                ALTER TABLE dbo.[event] ALTER COLUMN active BIT NOT NULL;
            END
            """;
        jdbc.execute(sql);
    }
}
