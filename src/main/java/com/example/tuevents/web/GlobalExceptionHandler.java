package com.example.tuevents.web;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadIdFormatException.class)
    public ResponseEntity<ErrorResponse> badId(BadIdFormatException ex, HttpServletRequest req){
        var body = ErrorResponse.of(400,"Bad Request","BAD_ID_FORMAT",ex.getMessage(),req.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> rse(ResponseStatusException ex, HttpServletRequest req){
        int s = ex.getStatusCode().value();
        var body = ErrorResponse.of(
                s,
                ex.getStatusCode().toString(),
                // โค้ดภายในสำหรับ not found
                s == 404 ? "EVT_NOT_FOUND" : "ERROR",
                ex.getReason(),
                req.getRequestURI()
        );
        return ResponseEntity.status(ex.getStatusCode()).body(body);
    }
}