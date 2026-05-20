package com.gummi.auth.dto;

import java.util.UUID;

public class AuthResponse {

    private UUID userId;
    private String fullName;
    private String email;
    private String role;
    private String token;

    public AuthResponse(UUID userId, String fullName, String email, String role, String token) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.token = token;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }
}