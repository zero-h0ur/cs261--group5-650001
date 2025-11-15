package com.example.tuevents.service;

import com.example.tuevents.model.Account;
import com.example.tuevents.model.Event;
import com.example.tuevents.model.UserFavorite;
import com.example.tuevents.repo.EventRepository;
import com.example.tuevents.repo.UserFavoriteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

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
     * เพิ่มกิจกรรมเข้า Favorites
     * - 404 ถ้าไม่พบหรือ event ไม่พร้อมใช้งาน (inactive)
     * - 409 ถ้ามี favorite รายการนี้อยู่แล้ว
     */
    public void addFavorite(Account account, Long eventId) {
    	Event event = eventRepository.findByEventIdAndActiveTrue(eventId) 
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ไม่พบกิจกรรม"));
    	
    	 boolean exists = userFavoriteRepository.existsByAccountAndEvent(account, event);
         if (exists) {
        	 throw new ResponseStatusException(HttpStatus.CONFLICT, "กิจกรรมนี้ถูกเพิ่มใน Favorites แล้ว");
         }
         
         UserFavorite fav = new UserFavorite();
         fav.setAccount(account);
         fav.setEvent(event);
         userFavoriteRepository.save(fav);
    }
    
    /**
     * ลบกิจกรรมออกจาก Favorites
     * - 404 ถ้าไม่พบ favorite ของ eventId นี้ใน account นี้
     */
    public void removeFavorite(Account account, Long eventId) {
        Event event = eventRepository.findByEventIdAndActiveTrue(eventId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบกิจกรรม"));

        UserFavorite fav = userFavoriteRepository.findByAccountAndEvent(account, event)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "ไม่พบรายการ Favorites ของกิจกรรมนี้"));

        userFavoriteRepository.delete(fav);
    }
    
    /**
     * คืนค่ากิจกรรมที่ผู้ใช้กด Favorites แบบแบ่งหน้า
     * ใช้ EventDetailDTO เหมือน API อื่น ๆ
     */
    public Page<EventDetailDTO> getFavoriteEvents(Account account, Pageable pageable) {
        return userFavoriteRepository.findByAccount(account, pageable)
                .map(fav -> EventDetailDTO.from(fav.getEvent()));
    }
    /**
     * คืนรายการ favorite ทั้งหมดของ account นี้
     */
    public List<UserFavorite> getFavoritesOf(Account account) {
        return userFavoriteRepository.findByAccount(account);
    }
}