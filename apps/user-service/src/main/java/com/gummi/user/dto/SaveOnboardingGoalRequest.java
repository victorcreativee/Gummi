package com.gummi.user.dto;

import com.gummi.user.model.OnboardingGoal;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class SaveOnboardingGoalRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotNull(message = "Onboarding goal is required")
    private OnboardingGoal primaryGoal;

    public UUID getUserId() {
        return userId;
    }

    public OnboardingGoal getPrimaryGoal() {
        return primaryGoal;
    }
}