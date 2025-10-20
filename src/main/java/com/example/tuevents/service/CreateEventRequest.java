package com.example.tuevents.service;

import jakarta.validation.constraints.*;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import java.time.LocalDate;

@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public record CreateEventRequest(
    @NotBlank 
    String title,
    
    @NotBlank 
    String description,
    
    String detail,

    @NotNull 
    @JsonAlias("categoryId")
    Long categoryId,
    
    @Min(1) 
    Integer capacity,

    @NotNull 
    @JsonFormat(pattern = "yyyy-MM-dd") 
    @JsonAlias("startDate")
    LocalDate startDate,
    
    @NotNull 
    @JsonFormat(pattern = "yyyy-MM-dd") 
    @JsonAlias("endDate")
    LocalDate endDate,

    @NotBlank 
    String location,
    
    String organizer,
    
    @JsonAlias("organizerContact")
    String organizerContact,
    
    @JsonAlias("imageUrl")
    String imageUrl,
    
    String time
) {}
