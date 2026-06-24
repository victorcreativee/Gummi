package com.gummi.proof.dto;

import com.gummi.proof.model.CareerCategory;
import com.gummi.proof.model.ProofType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CreateProofRequest {

    @NotNull(message = "User ID is required")
    private UUID userId;
    private UUID projectId; 

    @NotBlank(message = "Title is required")
    @Size(max = 160, message = "Title is too long")
    private String title;

    @NotNull(message = "Career category is required")
    private CareerCategory careerCategory;

    @NotNull(message = "Proof type is required")
    private ProofType proofType;

    @NotBlank(message = "Description is required")
    @Size(max = 1200, message = "Description is too long")
    private String description;
    private String challenge;
    private String process;
    private String outcome;
    private String proofLink;
    private String mediaUrl;
    private String toolsUsed;

    public UUID getUserId() {
        return userId;
    }
    public UUID getProjectId() {
        return projectId;
    }
    public String getTitle() {
        return title;
    }

    public CareerCategory getCareerCategory() {
        return careerCategory;
    }

    public ProofType getProofType() {
        return proofType;
    }

    public String getDescription() {
        return description;
    }
    public String getChallenge() {
        return challenge;
    }
    
    public String getProcess() {
        return process;
    }
    
    public String getOutcome() {
        return outcome;
    }

    public String getProofLink() {
        return proofLink;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public String getToolsUsed() {
        return toolsUsed;
    }
}