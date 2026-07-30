package com.gummi.talent.service;

import com.gummi.talent.dto.AddInterestRequest;
import com.gummi.talent.model.MemberInterest;
import com.gummi.talent.repository.MemberInterestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class MemberInterestService {

    private final MemberInterestRepository memberInterestRepository;

    public MemberInterestService(
            MemberInterestRepository memberInterestRepository
    ) {
        this.memberInterestRepository = memberInterestRepository;
    }

    @Transactional
    public MemberInterest addInterest(AddInterestRequest request) {
        String normalizedInterestName = normalizeName(
                request.getInterestName()
        );

        boolean alreadyExists =
                memberInterestRepository
                        .existsByUserIdAndInterestNameIgnoreCase(
                                request.getUserId(),
                                normalizedInterestName
                        );

        if (alreadyExists) {
            throw new IllegalArgumentException(
                    "This interest is already added"
            );
        }

        MemberInterest interest = new MemberInterest();
        interest.setUserId(request.getUserId());
        interest.setInterestName(normalizedInterestName);

        return memberInterestRepository.save(interest);
    }

    @Transactional(readOnly = true)
    public List<MemberInterest> getInterests(UUID userId) {
        return memberInterestRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    private String normalizeName(String value) {
        return value.trim().replaceAll("\\s+", " ");
    }
}