package com.gummi.user.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class CompleteOnboardingRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    public UUID getUserId() {
        return userId;
    }
}