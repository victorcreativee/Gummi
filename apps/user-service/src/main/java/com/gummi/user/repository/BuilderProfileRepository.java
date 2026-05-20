package com.gummi.user.repository;

import com.gummi.user.model.BuilderProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BuilderProfileRepository extends JpaRepository<BuilderProfile, UUID> {
    Optional<BuilderProfile> findByUserId(UUID userId);
}