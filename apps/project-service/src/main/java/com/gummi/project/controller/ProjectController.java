package com.gummi.project.controller;

import com.gummi.project.dto.CreateProjectRequest;
import com.gummi.project.dto.JoinProjectRequest;
import com.gummi.project.model.Project;
import com.gummi.project.model.ProjectMember;
import com.gummi.project.service.ProjectService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public Project createProject(@RequestBody CreateProjectRequest request) {
        return projectService.createProject(request);
    }

    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }

    @GetMapping("/{projectId}")
    public Project getProjectById(@PathVariable UUID projectId) {
        return projectService.getProjectById(projectId);
    }

    @GetMapping("/owner/{ownerId}")
    public List<Project> getProjectsByOwner(@PathVariable UUID ownerId) {
        return projectService.getProjectsByOwner(ownerId);
    }

    @PostMapping("/join")
    public ProjectMember joinProject(@RequestBody JoinProjectRequest request) {
        return projectService.joinProject(request);
    }

    @GetMapping("/{projectId}/members")
    public List<ProjectMember> getProjectMembers(@PathVariable UUID projectId) {
        return projectService.getMembers(projectId);
    }
}