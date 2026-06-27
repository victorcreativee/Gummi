package com.gummi.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectProxyController {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${gummi.services.project-url}")
    private String projectServiceUrl;

    @PostMapping
    public ResponseEntity<Object> createProject(@RequestBody Map<String, Object> request) {
        Object response = restTemplate.postForObject(
                projectServiceUrl + "/projects",
                request,
                Object.class
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Object> getAllProjects() {
        Object response = restTemplate.getForObject(
                projectServiceUrl + "/projects",
                Object.class
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Object> getProjectById(@PathVariable UUID projectId) {
        Object response = restTemplate.getForObject(
                projectServiceUrl + "/projects/" + projectId,
                Object.class
        );

        return ResponseEntity.ok(response);
    }

    @PostMapping("/join")
    public ResponseEntity<Object> joinProject(@RequestBody Map<String, Object> request) {
        Object response = restTemplate.postForObject(
                projectServiceUrl + "/projects/join",
                request,
                Object.class
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<Object> getProjectMembers(@PathVariable UUID projectId) {
        Object response = restTemplate.getForObject(
                projectServiceUrl + "/projects/" + projectId + "/members",
                Object.class
        );

        return ResponseEntity.ok(response);
    }
    @PostMapping("/{projectId}/milestones")
    public ResponseEntity<Object> createMilestone(
            @PathVariable UUID projectId,
            @RequestBody Map<String, Object> request
    ) {
        Object response = restTemplate.postForObject(
                projectServiceUrl + "/projects/" + projectId + "/milestones",
                request,
                Object.class
        );
    
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{projectId}/milestones")
    public ResponseEntity<Object> getMilestones(@PathVariable UUID projectId) {
        Object response = restTemplate.getForObject(
                projectServiceUrl + "/projects/" + projectId + "/milestones",
                Object.class
        );
    
        return ResponseEntity.ok(response);
    }
}