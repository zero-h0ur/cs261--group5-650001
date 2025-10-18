package com.example.tuevents.service;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record CreateEventRequest(
        @NotBlank String title,
        @NotBlank String description,
        @NotNull  LocalDate startDate,
        @NotNull  LocalDate endDate,
        String time,                 // เช่น "09:00 - 16:00"
        @NotBlank String location,
        String organizer,            // ผู้จัด (optional)
        String detail,               // รายละเอียดเชิงลึก (optional)
        String organizerContact,     // ช่องทางติดต่อ (optional)
        String imageUrl,             // URL รูป (optional)
        @Min(1) Integer capacity,    // จำนวนที่นั่ง (optional)
        @NotNull Long categoryId     // ผูกหมวดหมู่ด้วย id
) {}
