package com.example.tuevents.service;

import com.example.tuevents.model.Event;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.util.Collection;
import java.util.Date;

public class EventSpecifications {

    public static Specification<Event> hasCategories(Collection<Long> ids) {
        return (root, query, cb) ->
            (ids == null || ids.isEmpty())
                ? cb.conjunction()
                : root.get("category").get("categoryId").in(ids);
    }

    public static Specification<Event> titleOrDescriptionContains(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) return cb.conjunction(); // กัน NPE เวลา and/where
            String like = "%" + keyword.trim().toLowerCase() + "%";
            return cb.or(
                cb.like(cb.lower(root.get("title")), like),
                cb.like(cb.lower(root.get("description")), like),
                cb.like(cb.lower(root.get("detail")), like) // ถ้ามี field detail ให้ค้นหาด้วย
            );
        };
    }

    // ช่วงเวลาทับซ้อน: endDate >= start AND startDate <= end
    public static Specification<Event> dateOverlaps(Date start, Date end) {
        return (root, query, cb) -> {
            Predicate p = cb.conjunction();
            if (start != null) p = cb.and(p, cb.greaterThanOrEqualTo(root.get("endDate"), start));
            if (end   != null) p = cb.and(p, cb.lessThanOrEqualTo(root.get("startDate"), end));
            return p;
        };
    }

    public static Specification<Event> alwaysTrue() {
        return (root, query, cb) -> cb.conjunction();
    }
}
