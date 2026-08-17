package com.gummi.user.service;

import com.gummi.user.dto.CompleteOnboardingRequest;
import com.gummi.user.dto.SaveOnboardingGoalRequest;
import com.gummi.user.model.MemberOnboarding;
import com.gummi.user.repository.MemberOnboardingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;
import java.util.UUID;

@Service
public class MemberOnboardingService {

    private final MemberOnboardingRepository onboardingRepository;

    public MemberOnboardingService(
            MemberOnboardingRepository onboardingRepository
    ) {
        this.onboardingRepository = onboardingRepository;
    }

    public MemberOnboarding saveGoal(
            SaveOnboardingGoalRequest request
    ) {
        MemberOnboarding onboarding = onboardingRepository
                .findByUserId(request.getUserId())
                .orElseGet(MemberOnboarding::new);

        onboarding.setUserId(request.getUserId());
        onboarding.setPrimaryGoal(request.getPrimaryGoal());
        onboarding.touch();

        return onboardingRepository.save(onboarding);
    }

    public MemberOnboarding completeOnboarding(
            CompleteOnboardingRequest request
    ) {
        MemberOnboarding onboarding = onboardingRepository
                .findByUserId(request.getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Choose an onboarding goal before completing onboarding"
                ));

        onboarding.markCompleted();

        return onboardingRepository.save(onboarding);
    }

    public Optional<MemberOnboarding> getByUserId(UUID userId) {
        return onboardingRepository.findByUserId(userId);
    }
}