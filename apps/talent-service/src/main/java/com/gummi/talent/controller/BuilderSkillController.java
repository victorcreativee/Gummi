package com.gummi.talent.controller;

import com.gummi.talent.dto.AddSkillRequest;
import com.gummi.talent.model.BuilderSkill;
import com.gummi.talent.service.BuilderSkillService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/talent/skills")
public class BuilderSkillController {

    private final BuilderSkillService builderSkillService;

    public BuilderSkillController(BuilderSkillService builderSkillService) {
        this.builderSkillService = builderSkillService;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "success", true,
                "service", "talent-service",
                "status", "healthy",
                "timestamp", Instant.now().toString()
        );
    }

    @PostMapping
    public BuilderSkill addSkill(@Valid @RequestBody AddSkillRequest request) {
        return builderSkillService.addSkill(request);
    }

    @GetMapping("/{userId}")
    public List<BuilderSkill> getSkills(@PathVariable UUID userId) {
        return builderSkillService.getSkills(userId);
    }
}