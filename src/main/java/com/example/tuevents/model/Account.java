package com.example.tuevents.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
    name = "account",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"anon_id"})
    }
)
public class Account {

	//Start Task4 : US6
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "account_type", nullable = false, length = 20)
    private String accountType = "guest";

    @Column(name = "anon_id", nullable = false, length = 36, unique = true)
    private String anonId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    //Start Task4 : US6
    @PrePersist
    protected void onCreate() {
        if (anonId == null || anonId.isBlank()) {
            anonId = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (accountType == null || accountType.isBlank()) {
            accountType = "guest";
        }
    }
    //End Task4 : US6
    
    //Start GetSet Task4 : US6
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccountType() { return accountType; }
    public void setAccountType(String accountType) { this.accountType = accountType; }

    public String getAnonId() { return anonId; }
    public void setAnonId(String anonId) { this.anonId = anonId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    //End GetSet Task4 : US6
}