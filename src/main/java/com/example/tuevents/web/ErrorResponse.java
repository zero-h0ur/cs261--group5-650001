package com.example.tuevents.web;

import java.time.Instant;

public record ErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String code,      // รหัสภายใน เช่น EVT_NOT_FOUND, BAD_ID_FORMAT, INACTIVE_EVENT
        String message,
        String path
) {
    public static ErrorResponse of(int status, String error, String code, String message, String path) {
        return new ErrorResponse(Instant.now(), status, error, code, message, path);
    }
}