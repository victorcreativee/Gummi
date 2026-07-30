package com.gummi.talent.model;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
        name = "member_interests",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_member_interest_user_name",
                        columnNames = {"user_id", "interest_name"}
                )
        }
)
public class MemberInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "interest_name", nullable = false, length = 120)
    private String interestName;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public UUID getId() {
        return id;
    }

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
        this.interestName = normalizeName(interestName);
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    private String normalizeName(String value) {
        if (value == null) {
            return null;
        }

        return value.trim().replaceAll("\\s+", " ");
    }
}