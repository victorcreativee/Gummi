package com.gummi.user.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class UpsertProfileRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    private String headline;
    private String location;
    private String availability;
    private String buildingNow;
    private String story;

    public UUID getUserId() {
        return userId;
    }

    public String getHeadline() {
        return headline;
    }

    public String getLocation() {
        return location;
    }

    public String getAvailability() {
        return availability;
    }

    public String getBuildingNow() {
        return buildingNow;
    }

    public String getStory() {
        return story;
    }
}