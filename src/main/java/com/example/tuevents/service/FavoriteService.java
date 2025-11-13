package com.example.tuevents.service;

import com.example.tuevents.model.Account;
import com.example.tuevents.model.Event;
import com.example.tuevents.model.UserFavorite;
import com.example.tuevents.repo.EventRepository;
import com.example.tuevents.repo.UserFavoriteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {

    private final UserFavoriteRepository userFavoriteRepository;
    private final EventRepository eventRepository;

    public FavoriteService(UserFavoriteRepository userFavoriteRepository,
                           EventRepository eventRepository) {
        this.userFavoriteRepository = userFavoriteRepository;
        this.eventRepository = eventRepository;
    }

    /**
     * กดปุ่ม Favorite/Unfavorite สำหรับ event หนึ่งรายการ
     * - ถ้าผู้ใช้เคยกดแล้ว -> ลบออก (unfavorite)
     * - ถ้ายังไม่เคยกด -> สร้าง UserFavorite ใหม่
     */
    public void toggleFavorite(Account account, Long eventId) {
        // หา Event ก่อน
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // หา favorite เดิมจาก Account + Event โดยตรง (ไม่ต้องใช้ id)
        var existingOpt = userFavoriteRepository.findByAccountAndEvent(account, event);

        if (existingOpt.isPresent()) {
            // เคยกดแล้ว -> ลบออก
            userFavoriteRepository.delete(existingOpt.get());
        } else {
            // ยังไม่เคยกด -> สร้างใหม่
            UserFavorite fav = new UserFavorite();
            fav.setAccount(account);
            fav.setEvent(event);
            userFavoriteRepository.save(fav);
        }
    }

    /**
     * คืนรายการ favorite ทั้งหมดของ account นี้
     */
    public List<UserFavorite> getFavoritesOf(Account account) {
        return userFavoriteRepository.findByAccount(account);
    }
}