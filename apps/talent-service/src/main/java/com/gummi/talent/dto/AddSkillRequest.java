package com.gummi.talent.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class AddSkillRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;

    @NotBlank(message = "Skill name is required")
    private String skillName;

    public UUID getUserId() {
        return userId;
    }

    public String getSkillName() {
        return skillName;
    }
}