package com.example.tuevents.service;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;

public record CreateEventRequest(
        @NotBlank String title,
        @NotBlank String description,

        @NotNull
        @JsonFormat(pattern = "yyyy-MM-dd")
        @JsonProperty("startDate")
        LocalDate startDate,

        @NotNull
        @JsonFormat(pattern = "yyyy-MM-dd")
        @JsonProperty("endDate")
        LocalDate endDate,

        String time,

        @NotBlank String location,

        String organizer,
        String detail,
        String organizerContact,
        String imageUrl,

        @Min(1) Integer capacity,

        @NotNull
        @JsonProperty("categoryId")
        Long categoryId
) {}
