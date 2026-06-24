package com.gummi.proof.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "proof_submissions")
public class ProofSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID userId;
    private UUID projectId;

    @Column(nullable = false, length = 160)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 60)
    private CareerCategory careerCategory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 60)
    private ProofType proofType;

    @Column(nullable = false, length = 1200)
    private String description;
    @Column(length = 1200)
    private String challenge;

    @Column(length = 1600)
    private String process;

    @Column(length = 1200)
    private String outcome;

    @Column(length = 500)
    private String proofLink;

    @Column(length = 500)
    private String mediaUrl;

    @Column(length = 500)
    private String toolsUsed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private ProofStatus status = ProofStatus.SUBMITTED;

    @Column(nullable = false)
    private Integer verificationScore = 0;
    
    @Column(length = 40)
    private String reviewStatus = "PENDING_REVIEW";

    @Column(length = 1000)
    private String reviewNotes;

    private UUID reviewedBy;

    private Instant reviewedAt;
    public String getReviewStatus() {
        return reviewStatus;
    }
    
    public String getReviewNotes() {
        return reviewNotes;
    }
    
    public UUID getReviewedBy() {
        return reviewedBy;
    }
    
    public Instant getReviewedAt() {
        return reviewedAt;
    }

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    private Instant updatedAt = Instant.now();

    public UUID getId() {
        return id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public UUID getProjectId() {
        return projectId;
    }
    
    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = clean(title);
    }

    public CareerCategory getCareerCategory() {
        return careerCategory;
    }

    public void setCareerCategory(CareerCategory careerCategory) {
        this.careerCategory = careerCategory;
    }

    public ProofType getProofType() {
        return proofType;
    }

    public void setProofType(ProofType proofType) {
        this.proofType = proofType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = clean(description);
    }
    public String getChallenge() {
        return challenge;
    }
    
    public void setChallenge(String challenge) {
        this.challenge = clean(challenge);
    }
    
    public String getProcess() {
        return process;
    }
    
    public void setProcess(String process) {
        this.process = clean(process);
    }
    
    public String getOutcome() {
        return outcome;
    }
    
    public void setOutcome(String outcome) {
        this.outcome = clean(outcome);
    }

    public String getProofLink() {
        return proofLink;
    }

    public void setProofLink(String proofLink) {
        this.proofLink = clean(proofLink);
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = clean(mediaUrl);
    }

    public String getToolsUsed() {
        return toolsUsed;
    }

    public void setToolsUsed(String toolsUsed) {
        this.toolsUsed = clean(toolsUsed);
    }

    public ProofStatus getStatus() {
        return status;
    }

    public Integer getVerificationScore() {
        return verificationScore;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void touch() {
        this.updatedAt = Instant.now();
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}