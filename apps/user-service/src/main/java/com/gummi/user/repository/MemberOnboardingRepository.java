package com.gummi.user.repository;

import com.gummi.user.model.MemberOnboarding;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface MemberOnboardingRepository
        extends JpaRepository<MemberOnboarding, UUID> {

    Optional<MemberOnboarding> findByUserId(UUID userId);
}