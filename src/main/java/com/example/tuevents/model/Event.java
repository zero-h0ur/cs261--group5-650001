package com.example.tuevents.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.*;

@Entity
@Table(
    name = "event",
    indexes = {
    	@Index(name = "idx_event_category_id", columnList = "category_id"),
        @Index(name = "idx_event_starts_at_ends_at", columnList = "starts_at, ends_at"),
        @Index(name = "idx_event_title", columnList = "title")
    }
)
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private Long eventId;

    @NotBlank
    @Column(name = "title", nullable = false, length = 200)
    private String title;
    
    @Lob
    @Column(name = "description", length = 255)
    private String description;

    // เพิ่ม start_date และ end_date ตาม US4
    @Temporal(TemporalType.DATE)
    @Column(name = "start_date")
    private Date startDate;
    
 // คอลัมน์ใหม่จาก US4
    @Column(name = "starts_at", nullable = false)
    private LocalDateTime startsAt;

    @Temporal(TemporalType.DATE)
    @Column(name = "end_date")
    private Date endDate;
    
    @Column(name = "ends_at")
    private LocalDateTime endsAt;
    //End US4

    private String time;
    private String location;
    private String organizer;
    private Integer capacity;
    private String imageUrl;
    
    // เพิ่ม field ตาม US2
    @Lob
    @Column(name = "detail", columnDefinition = "NVARCHAR(MAX)")
    private String detail;
    private String organizerContact;
    // US2 End
    
    // เพิ่ม field ตาม US5
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @Column(name = "active", nullable = false)
    private boolean active = true;  // ใหม่: ค่าเริ่มต้น true
    
    @PrePersist
    public void prePersist() {
        // set defaults เดิม...
        if (organizerContact == null) organizerContact = "";
        if (detail == null) detail = "";
        if (imageUrl == null) imageUrl = "";
        // active true โดยค่าเริ่มต้น
        calculateDatetimeFields();
    }
    
    @PreUpdate
    public void preUpdate() {
        // เวลาอัปเดตก็ให้คำนวณอีกครั้ง
        calculateDatetimeFields();
    }
    
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
    
    public void calculateDatetimeFields() {
        // ตรวจสอบว่ามีข้อมูลวัตถุดิบครบ
        if (startDate != null && time != null && !time.isEmpty()) {
            
            java.time.LocalDate datePart = startDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
            
            java.time.LocalTime timePart = java.time.LocalTime.parse(time);
            
            // 3. เอามารวมกันเป็น LocalDateTime
            this.startsAt = LocalDateTime.of(datePart, timePart);
            
            // 4. ทำ ends_at (ตามตรรกะ "ถ้า end_date ว่าง ให้ใช้ค่าเดียวกับ starts_at")
            if (endDate == null) {
                this.endsAt = this.startsAt; // จบวันเดียว
            } else {
                java.time.LocalDate endDatePart = endDate.toInstant()
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
                this.endsAt = LocalDateTime.of(endDatePart, timePart);
            }
        }
    }
    
	//Start Task4 : US6
    @OneToMany(mappedBy = "event", fetch = FetchType.LAZY)
    private List<UserFavorite> favorites = new ArrayList<>();
    //End Task4 : US6

    // --- getters/setters ---
    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    // ถ้าคุณมี getId()/setId() อยู่แล้ว จะคงไว้เป็น alias ก็ได้
    public Long getId() { return eventId; }
    public void setId(Long id) { this.eventId = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Date getStartDate() { return startDate; }
    public void setStartDate(Date startDate) { this.startDate = startDate; }

    public Date getEndDate() { return endDate; }
    public void setEndDate(Date endDate) { this.endDate = endDate; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getOrganizer() { return organizer; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getDetail() { return detail; }
    public void setDetail(String detail) { this.detail = detail; }

    public String getOrganizerContact() { return organizerContact; }
    public void setOrganizerContact(String organizerContact) { this.organizerContact = organizerContact; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }
    
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}