package com.example.tuevents.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.util.Date;
import lombok.*;

@Entity
@Table(name = "event")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    private String title;
    private String description;

    // เพิ่ม start_date และ end_date ตาม US4
    @Temporal(TemporalType.DATE)
    @Column(name = "start_date")
    private Date startDate;

    @Temporal(TemporalType.DATE)
    @Column(name = "end_date")
    private Date endDate;
    //End US4

    private String time;
    private String location;
    private String organizer;
    private Integer capacity;
    private String imageUrl;
    
    // เพิ่ม field ตาม US2
    @Column(columnDefinition = "TEXT")
    private String detail;
    private String organizerContact;
    // US2 End
    
    // เพิ่ม field ตาม US5
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
    
    public Event() {}
    
    public Event(String title, String description, Date startDate, Date endDate, String time,
            String location, String organizer, String detail, String organizerContact,
            Integer capacity, String imageUrl, Category category) {
	   this.title = title;
	   this.description = description;
	   this.time = time;
	   this.location = location;
	   this.organizer = organizer;
	   this.capacity = capacity;
	   this.imageUrl = imageUrl;
	// เพิ่ม field ตาม US2
	   this.detail = detail;
	   this.organizerContact = organizerContact;
	// เพิ่ม start_date และ end_date ตาม US4
       this.startDate = startDate;
       this.endDate = endDate;
    // เพิ่ม field ตาม US5   
       this.category = category;
    }

    
    // --- getters/setters ---
    public Long getId() { return eventId; }
    public void setId(Long id) { this.eventId = eventId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }
    
    public Date getEndDate() { return endDate; }
    public void setEndDate(Date startDate) { this.endDate = endDate; }
}