package com.gummi.talent.repository;

import com.gummi.talent.model.BuilderSkill;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BuilderSkillRepository extends JpaRepository<BuilderSkill, UUID> {
    List<BuilderSkill> findByUserIdOrderByCreatedAtDesc(UUID userId);
    boolean existsByUserIdAndSkillNameIgnoreCase(UUID userId, String skillName);
}