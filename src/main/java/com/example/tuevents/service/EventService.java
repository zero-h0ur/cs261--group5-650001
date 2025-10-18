package com.example.tuevents.service;

import com.example.tuevents.model.Event;
import com.example.tuevents.model.Category;
import com.example.tuevents.repo.EventRepository;
import com.example.tuevents.repo.CategoryRepository;

import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventService {

    private final EventRepository repo;
    private final CategoryRepository categoryRepo;

    public EventService(EventRepository repo, CategoryRepository categoryRepo) {
        this.repo = repo;
        this.categoryRepo = categoryRepo;
    }

    // ฟิลด์ที่ยอมให้ sort ได้
    private static final Set<String> ALLOWED_SORTS = Set.of(
            "eventId", "title", "startDate", "endDate", "capacity", "location", "time", "organizer"
    );

    // ---------- LIST (ทั้งหมด/พร้อม filter หมวดหมู่) ----------
    public Page<Event> getAll(Integer page, Integer limit, String sort, String dir, List<Long> category) {
        int p = (page == null || page < 0) ? 0 : page;
        int l = (limit == null || limit <= 0) ? 10 : limit;

        String sortField = (sort == null || sort.isBlank()) ? "eventId" : sort.trim();
        if (!ALLOWED_SORTS.contains(sortField)) sortField = "eventId";
        

        Sort.Direction direction = "asc".equalsIgnoreCase(dir) ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(p, l, Sort.by(direction, sortField));

        Specification<Event> spec = EventSpecifications.alwaysTrue();
        if (category != null && !category.isEmpty()) {
            spec = spec.and(EventSpecifications.hasCategories(category));
        }
        return repo.findAll(spec, pageable);
    }

    // ---------- SEARCH ----------
    public Page<Event> search(String keyword, Pageable pageable) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return repo.findAll(pageable);
        }
        String k = keyword.trim();
        return repo.findByTitleContainingIgnoreCaseOrDescriptionContainingIgnoreCase(k, k, pageable);
    }

    // ---------- DATE RANGE ----------
    public Page<Event> findByDateRange(LocalDate start, LocalDate end, Pageable pageable) {
        if (start != null && end != null && start.isAfter(end)) {
            LocalDate tmp = start; start = end; end = tmp;
        }
        java.sql.Date s = (start != null) ? java.sql.Date.valueOf(start) : null;
        java.sql.Date e = (end   != null) ? java.sql.Date.valueOf(end)   : null;
        return repo.findByDateRangeOverlap(s, e, pageable);
        // ถ้าต้องการเงื่อนไข "อยู่ในช่วงทั้งหมด": return repo.findByDateRangeWithin(s, e, pageable);
    }

    // ---------- DETAIL ----------
    public EventDetailDTO getById(Long id) {
        Event e = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
        return EventDetailDTO.from(e);
    }

    // ---------- FILTER (ออปชันรวมหลายเงื่อนไข) ----------
    public Page<Event> filter(String categoriesCsv, String keyword, LocalDate start, LocalDate end, Pageable pageable) {
        if (start != null && end != null && start.isAfter(end)) {
            LocalDate t = start; start = end; end = t;
        }
        Date s = (start != null) ? java.sql.Date.valueOf(start) : null;
        Date e = (end   != null) ? java.sql.Date.valueOf(end)   : null;

        List<Long> ids = parseIds(categoriesCsv);

        Specification<Event> spec = Specification.anyOf(
                EventSpecifications.hasCategories(ids),
                EventSpecifications.titleOrDescriptionContains(keyword),
                EventSpecifications.dateOverlaps(s, e)
        );
        return repo.findAll(spec, pageable);
    }

    private List<Long> parseIds(String csv) {
        if (csv == null || csv.isBlank()) return Collections.emptyList();
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .filter(x -> !x.isEmpty())
                .map(x -> {
                    try { return Long.parseLong(x); } catch (NumberFormatException ex) { return null; }
                })
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    // ---------- CREATE ----------
    public EventDetailDTO create(CreateEventRequest req) {
        // swap วันที่ถ้าผิดลำดับ
        var start = req.startDate();
        var end   = req.endDate();
        if (start != null && end != null && start.isAfter(end)) {
            var t = start; start = end; end = t;
        }

        Category cat = categoryRepo.findById(req.categoryId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Category not found"));

        Event e = new Event();
        e.setTitle(req.title());
        e.setDescription(req.description());
        e.setStartDate(java.sql.Date.valueOf(start));
        e.setEndDate(java.sql.Date.valueOf(end));
        e.setTime(req.time());
        e.setLocation(req.location());
        e.setOrganizer(req.organizer());
        e.setDetail(req.detail());
        e.setOrganizerContact(req.organizerContact());
        e.setImageUrl(req.imageUrl());
        e.setCapacity(req.capacity());
        e.setCategory(cat);

        Event saved = repo.save(e);
        return EventDetailDTO.from(saved);
    }
}
