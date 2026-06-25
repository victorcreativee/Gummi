package com.gummi.proof.repository;

import com.gummi.proof.model.ProofSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ProofSubmissionRepository extends JpaRepository<ProofSubmission, UUID> {
    List<ProofSubmission> findByUserIdOrderByCreatedAtDesc(UUID userId);
    List<ProofSubmission> findByProjectId(UUID projectId);
}