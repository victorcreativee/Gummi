package com.gummi.user.service;

import com.gummi.user.dto.UpsertProfileRequest;
import com.gummi.user.model.BuilderProfile;
import com.gummi.user.repository.BuilderProfileRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class BuilderProfileService {

    private final BuilderProfileRepository profileRepository;

    public BuilderProfileService(BuilderProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public BuilderProfile upsertProfile(UpsertProfileRequest request) {
        BuilderProfile profile = profileRepository
                .findByUserId(request.getUserId())
                .orElseGet(BuilderProfile::new);

        profile.setUserId(request.getUserId());
        profile.setHeadline(clean(request.getHeadline()));
        profile.setLocation(clean(request.getLocation()));
        profile.setAvailability(clean(request.getAvailability()));
        profile.setBuildingNow(clean(request.getBuildingNow()));
        profile.setStory(clean(request.getStory()));
        profile.touch();

        return profileRepository.save(profile);
    }

    public Optional<BuilderProfile> getProfile(UUID userId) {
        return profileRepository.findByUserId(userId);
    }

    private String clean(String value) {
        return value == null ? null : value.trim();
    }
}