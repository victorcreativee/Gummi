package com.gummi.project.repository;

import com.gummi.project.model.ProjectMilestone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProjectMilestoneRepository extends JpaRepository<ProjectMilestone, UUID> {
    List<ProjectMilestone> findByProjectIdOrderByCreatedAtDesc(UUID projectId);
}