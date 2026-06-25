package com.gummi.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/proofs")
public class ProofProxyController {

    private final RestClient restClient;

    @Value("${gummi.services.proof-url}")
    private String proofServiceUrl;

    public ProofProxyController(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    @GetMapping("/health")
    public Map health() {
        return restClient.get()
                .uri(proofServiceUrl + "/api/proofs/health")
                .retrieve()
                .body(Map.class);
    }

    @PostMapping
    public Map createProof(@RequestBody Map<String, Object> body) {
        return restClient.post()
                .uri(proofServiceUrl + "/api/proofs")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);
    }

    @GetMapping("/user/{userId}")
    public List getUserProofs(@PathVariable String userId) {
        return restClient.get()
                .uri(proofServiceUrl + "/api/proofs/user/" + userId)
                .retrieve()
                .body(List.class);
    }
    @GetMapping("/project/{projectId}")
    public List getProjectProofs(@PathVariable String projectId) {
        return restClient.get()
                .uri(proofServiceUrl + "/api/proofs/project/" + projectId)
                .retrieve()
                .body(List.class);
    }
    @GetMapping("/{proofId}")
    public Map getProofById(@PathVariable String proofId) {
        return restClient.get()
            .uri(proofServiceUrl + "/api/proofs/" + proofId)
            .retrieve()
            .body(Map.class);   
    }
    
    
}