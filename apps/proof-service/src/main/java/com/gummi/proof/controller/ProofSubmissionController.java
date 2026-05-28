package com.gummi.proof.controller;

import com.gummi.proof.dto.CreateProofRequest;
import com.gummi.proof.model.ProofSubmission;
import com.gummi.proof.service.ProofSubmissionService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/proofs")
public class ProofSubmissionController {

    private final ProofSubmissionService proofSubmissionService;

    public ProofSubmissionController(ProofSubmissionService proofSubmissionService) {
        this.proofSubmissionService = proofSubmissionService;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "success", true,
                "service", "proof-service",
                "status", "healthy",
                "timestamp", Instant.now().toString()
        );
    }

    @PostMapping
    public ProofSubmission createProof(@Valid @RequestBody CreateProofRequest request) {
        return proofSubmissionService.createProof(request);
    }

    @GetMapping("/user/{userId}")
    public List<ProofSubmission> getUserProofs(@PathVariable UUID userId) {
        return proofSubmissionService.getUserProofs(userId);
    }
    @GetMapping("/{proofId}")   

    public ProofSubmission getProofById(@PathVariable UUID proofId) {
        return proofSubmissionService.getProofById(proofId);
    }
}