package com.gummi.user.model;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "member_onboarding")
public class MemberOnboarding {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private OnboardingGoal primaryGoal;

    @Column(nullable = false)
    private boolean onboardingCompleted = false;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
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

    public OnboardingGoal getPrimaryGoal() {
        return primaryGoal;
    }

    public void setPrimaryGoal(OnboardingGoal primaryGoal) {
        this.primaryGoal = primaryGoal;
    }

    public boolean isOnboardingCompleted() {
        return onboardingCompleted;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void markCompleted() {
        this.onboardingCompleted = true;
        touch();
    }

    public void touch() {
        this.updatedAt = Instant.now();
    }
}