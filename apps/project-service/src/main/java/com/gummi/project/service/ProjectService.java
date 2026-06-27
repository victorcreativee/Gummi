package com.gummi.project.service;

import com.gummi.project.dto.CreateProjectRequest;
import com.gummi.project.dto.JoinProjectRequest;
import com.gummi.project.model.Project;
import com.gummi.project.model.ProjectMember;
import com.gummi.project.model.ProjectStatus;
import com.gummi.project.repository.ProjectMemberRepository;
import com.gummi.project.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import com.gummi.project.dto.CreateMilestoneRequest;
import com.gummi.project.model.ProjectMilestone;
import com.gummi.project.repository.ProjectMilestoneRepository;

import java.util.List;
import java.util.UUID;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    private final ProjectMemberRepository memberRepository;
    private final ProjectMilestoneRepository milestoneRepository;

    public ProjectService(
        ProjectRepository projectRepository,
        ProjectMemberRepository memberRepository,
        ProjectMilestoneRepository milestoneRepository
) {
    this.projectRepository = projectRepository;
    this.memberRepository = memberRepository;
    this.milestoneRepository = milestoneRepository;
}

    public Project createProject(CreateProjectRequest request) {
        Project project = new Project();

        project.setOwnerId(request.ownerId);
        project.setTitle(request.title);
        project.setDescription(request.description);
        project.setCategory(request.category);
        project.setNeededRoles(request.neededRoles);
        project.setStatus(ProjectStatus.LOOKING_FOR_MEMBERS);

        return projectRepository.save(project);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public List<Project> getProjectsByOwner(UUID ownerId) {
        return projectRepository.findByOwnerId(ownerId);
    }

    public Project getProjectById(UUID projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public ProjectMember joinProject(JoinProjectRequest request) {
        ProjectMember member = new ProjectMember();

        member.setProjectId(request.projectId);
        member.setUserId(request.userId);
        member.setRole(request.role);

        return memberRepository.save(member);
    }

    public List<ProjectMember> getMembers(UUID projectId) {
        return memberRepository.findByProjectId(projectId);
    }
    public ProjectMilestone createMilestone(UUID projectId, CreateMilestoneRequest request) {
        getProjectById(projectId);
    
        ProjectMilestone milestone = new ProjectMilestone();
        milestone.setProjectId(projectId);
        milestone.setTitle(request.title);
        milestone.setDescription(request.description);
    
        return milestoneRepository.save(milestone);
    }
    
    public List<ProjectMilestone> getMilestones(UUID projectId) {
        getProjectById(projectId);
        return milestoneRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
    }
}