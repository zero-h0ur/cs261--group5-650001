package com.example.tuevents.service;

import com.example.tuevents.model.Event;
import java.time.LocalDate;
import java.time.ZoneId;

public record EventDetailDTO(
        Long eventId,
        String title,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        String time,
        String location,
        String organizer,
        Integer capacity,
        String organizerContact,
        String imageUrl,
        Long categoryId,
        String categoryName
) {
    public static EventDetailDTO from(Event e) {
        Long catId   = (e.getCategory() != null) ? e.getCategory().getCategoryId()   : null;
        String catNm = (e.getCategory() != null) ? e.getCategory().getCategoryName() : null;

        return new EventDetailDTO(
                e.getId(),
                e.getTitle(),
                (e.getDescription() != null) ? e.getDescription() : e.getDetail(), // ถ้า description ว่าง ใช้ detail แทน
                toLocalDate(e.getStartDate()),
                toLocalDate(e.getEndDate()),
                e.getTime(),
                e.getLocation(),
                e.getOrganizer(),
                e.getCapacity(),
                e.getOrganizerContact(),
                e.getImageUrl(),
                catId,
                catNm
        );
    }

    private static LocalDate toLocalDate(java.util.Date d) {
        if (d == null) return null;
        if (d instanceof java.sql.Date sd) return sd.toLocalDate();
        return d.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }
}
