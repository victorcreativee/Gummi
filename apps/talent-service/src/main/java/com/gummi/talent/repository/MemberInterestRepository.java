package com.gummi.talent.repository;

import com.gummi.talent.model.MemberInterest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MemberInterestRepository
        extends JpaRepository<MemberInterest, UUID> {

    List<MemberInterest> findByUserIdOrderByCreatedAtDesc(UUID userId);

    boolean existsByUserIdAndInterestNameIgnoreCase(
            UUID userId,
            String interestName
    );
}