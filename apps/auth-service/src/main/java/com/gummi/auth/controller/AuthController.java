package com.gummi.auth.controller;

import com.gummi.auth.dto.AuthResponse;
import com.gummi.auth.dto.LoginRequest;
import com.gummi.auth.dto.RegisterRequest;
import com.gummi.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "success", true,
                "service", "auth-service",
                "status", "healthy",
                "timestamp", Instant.now().toString()
        );
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}