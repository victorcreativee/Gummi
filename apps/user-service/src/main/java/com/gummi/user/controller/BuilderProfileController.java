package com.gummi.user.controller;

import com.gummi.user.dto.UpsertProfileRequest;
import com.gummi.user.model.BuilderProfile;
import com.gummi.user.service.BuilderProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users/profiles")
public class BuilderProfileController {

    private final BuilderProfileService profileService;

    public BuilderProfileController(BuilderProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "success", true,
                "service", "user-service",
                "status", "healthy",
                "timestamp", Instant.now().toString()
        );
    }

    @PostMapping
    public BuilderProfile upsertProfile(@Valid @RequestBody UpsertProfileRequest request) {
        return profileService.upsertProfile(request);
    }

    @GetMapping("/{userId}")
    public Object getProfile(@PathVariable UUID userId) {
        return profileService.getProfile(userId).orElse(null);
    }
}