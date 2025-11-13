package com.example.tuevents.controller;

import com.example.tuevents.model.Account;
import com.example.tuevents.service.FavoriteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    // ตัวอย่าง: toggle favorite
    @PostMapping("/{eventId}")
    public void toggleFavorite(@PathVariable Long eventId,
                               @RequestAttribute("account") Account account) {
    	System.out.println("Controller have an account: " + account.getAnonId());
        favoriteService.toggleFavorite(account, eventId);
    }

    // ตัวอย่าง: list favorites ของ account ปัจจุบัน
    @GetMapping
    public List<?> listFavorites(@RequestAttribute("account") Account account) {
        return favoriteService.getFavoritesOf(account);
    }
}