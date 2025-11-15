package com.example.tuevents.controller;

import com.example.tuevents.model.Account;
import com.example.tuevents.service.FavoriteService;
import com.example.tuevents.service.EventDetailDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 10;

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    private Account requireAccount(Account account) {
        if (account == null) {
            // ถ้า Interceptor ไม่ได้แปะ Account มาให้ -> 401 ตาม DoD
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ไม่พบ anonymous account");
        }
        return account;
    }

    /**
     * GET /api/favorites
     * ดึงรายการกิจกรรมที่ผู้ใช้สนใจ
     * รองรับ page, size, sort (เช่น sort=createdAt,desc)
     * Response: 200 OK + Page<EventDetailDTO> เป็น JSON
     */
    @GetMapping
    public Page<EventDetailDTO> listFavorites(
            @RequestAttribute(value = "account", required = false) Account account,
            @RequestParam(value = "page", required = false) Integer page,
            @RequestParam(value = "size", required = false) Integer size,
            @RequestParam(value = "sort", required = false, defaultValue = "createdAt,desc") String sortParam
    ) {
        Account acc = requireAccount(account);

        int p = (page == null || page < 0) ? DEFAULT_PAGE : page;
        int s = (size == null || size <= 0) ? DEFAULT_SIZE : size;

        String property = "createdAt";
        Sort.Direction direction = Sort.Direction.DESC;

        if (sortParam != null && !sortParam.isBlank()) {
            String[] parts = sortParam.split(",");
            if (parts.length >= 1 && !parts[0].isBlank()) {
                property = parts[0].trim();
            }
            if (parts.length >= 2 && "asc".equalsIgnoreCase(parts[1].trim())) {
                direction = Sort.Direction.ASC;
            }
        }

        // กัน user ใส่ชื่อ field แปลก ๆ
        if (!"createdAt".equals(property) && !"id".equals(property)) {
            property = "createdAt";
        }

        Pageable pageable = PageRequest.of(p, s, Sort.by(direction, property));
        return favoriteService.getFavoriteEvents(acc, pageable);
    }

    /**
     * POST /api/favorites/{eventId}
     * เพิ่มกิจกรรมเป็น Favorites
     * - 201 Created เมื่อเพิ่มใหม่สำเร็จ
     * - 409 Conflict ถ้า favorite ซ้ำ
     * - 404 Not Found ถ้า event ไม่พบ/ไม่พร้อมใช้งาน
     * - 401 Unauthorized ถ้าไม่มี anon account
     */
    @PostMapping("/{eventId}")
    public ResponseEntity<Void> addFavorite(
            @RequestAttribute(value = "account", required = false) Account account,
            @PathVariable("eventId") Long eventId
    ) {
        Account acc = requireAccount(account);
        favoriteService.addFavorite(acc, eventId);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    /**
     * DELETE /api/favorites/{eventId}
     * ลบกิจกรรมออกจาก Favorites
     * - 204 No Content เมื่อสำเร็จ
     * - 404 Not Found ถ้าไม่พบ favorite รายการนี้
     * - 401 Unauthorized ถ้าไม่มี anon account
     */
    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeFavorite(
            @RequestAttribute(value = "account", required = false) Account account,
            @PathVariable("eventId") Long eventId
    ) {
        Account acc = requireAccount(account);
        favoriteService.removeFavorite(acc, eventId);
    }
}