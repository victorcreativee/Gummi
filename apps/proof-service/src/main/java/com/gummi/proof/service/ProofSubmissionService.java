package com.gummi.proof.service;

import com.gummi.proof.dto.CreateProofRequest;
import com.gummi.proof.model.ProofSubmission;
import com.gummi.proof.repository.ProofSubmissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class ProofSubmissionService {

    private final ProofSubmissionRepository proofSubmissionRepository;

    public ProofSubmissionService(ProofSubmissionRepository proofSubmissionRepository) {
        this.proofSubmissionRepository = proofSubmissionRepository;
    }

    public ProofSubmission createProof(CreateProofRequest request) {
        ProofSubmission proof = new ProofSubmission();

        proof.setUserId(request.getUserId());
        proof.setProjectId(request.getProjectId());
        proof.setTitle(request.getTitle());
        proof.setCareerCategory(request.getCareerCategory());
        proof.setProofType(request.getProofType());
        proof.setDescription(request.getDescription());
        proof.setChallenge(request.getChallenge());
        proof.setProcess(request.getProcess());
        proof.setOutcome(request.getOutcome());
        proof.setProofLink(request.getProofLink());
        proof.setMediaUrl(request.getMediaUrl());
        proof.setToolsUsed(request.getToolsUsed());
        proof.touch();

        return proofSubmissionRepository.save(proof);
    }

    public List<ProofSubmission> getUserProofs(UUID userId) {
        return proofSubmissionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    public ProofSubmission getProofById(UUID proofId) {
        return proofSubmissionRepository.findById(proofId)
                .orElseThrow(() -> new RuntimeException("Proof not found"));
    }
    public List<ProofSubmission> getProjectProofs(UUID projectId) {
        return proofSubmissionRepository.findByProjectId(projectId);
    }
    
}