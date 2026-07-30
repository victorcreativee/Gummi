package com.gummi.talent.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class AddInterestRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "Interest name is required")
    @Size(
            min = 2,
            max = 120,
            message = "Interest name must contain between 2 and 120 characters"
    )
    private String interestName;

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getInterestName() {
        return interestName;
    }

    public void setInterestName(String interestName) {
        this.interestName = interestName;
    }
}