package com.gummi.user.controller;

import com.gummi.user.dto.CompleteOnboardingRequest;
import com.gummi.user.dto.SaveOnboardingGoalRequest;
import com.gummi.user.model.MemberOnboarding;
import com.gummi.user.service.MemberOnboardingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users/onboarding")
public class MemberOnboardingController {

    private final MemberOnboardingService onboardingService;

    public MemberOnboardingController(
            MemberOnboardingService onboardingService
    ) {
        this.onboardingService = onboardingService;
    }

    @PostMapping("/goal")
    public MemberOnboarding saveGoal(
            @Valid @RequestBody SaveOnboardingGoalRequest request
    ) {
        return onboardingService.saveGoal(request);
    }

    @PostMapping("/complete")
    public MemberOnboarding completeOnboarding(
            @Valid @RequestBody CompleteOnboardingRequest request
    ) {
        return onboardingService.completeOnboarding(request);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<MemberOnboarding> getOnboarding(
            @PathVariable UUID userId
    ) {
        return onboardingService
                .getByUserId(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }
}