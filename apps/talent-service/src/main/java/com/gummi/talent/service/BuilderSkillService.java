package com.gummi.talent.service;

import com.gummi.talent.dto.AddSkillRequest;
import com.gummi.talent.model.BuilderSkill;
import com.gummi.talent.repository.BuilderSkillRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class BuilderSkillService {

    private final BuilderSkillRepository builderSkillRepository;

    public BuilderSkillService(BuilderSkillRepository builderSkillRepository) {
        this.builderSkillRepository = builderSkillRepository;
    }

    public BuilderSkill addSkill(AddSkillRequest request) {
        boolean exists = builderSkillRepository.existsByUserIdAndSkillNameIgnoreCase(
                request.getUserId(),
                request.getSkillName()
        );

        if (exists) {
            throw new IllegalArgumentException("This skill is already added");
        }

        BuilderSkill skill = new BuilderSkill();
        skill.setUserId(request.getUserId());
        skill.setSkillName(request.getSkillName());

        return builderSkillRepository.save(skill);
    }

    public List<BuilderSkill> getSkills(UUID userId) {
        return builderSkillRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}