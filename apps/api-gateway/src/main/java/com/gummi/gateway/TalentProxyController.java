package com.gummi.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/talent")
public class TalentProxyController {

    private final RestClient restClient;

    @Value("${gummi.services.talent-url}")
    private String talentServiceUrl;

    public TalentProxyController(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    @GetMapping("/skills/health")
    public Map health() {
        return restClient.get()
                .uri(talentServiceUrl + "/api/talent/skills/health")
                .retrieve()
                .body(Map.class);
    }

    @PostMapping("/skills")
    public Map addSkill(@RequestBody Map<String, Object> body) {
        return restClient.post()
                .uri(talentServiceUrl + "/api/talent/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);
    }

    @GetMapping("/skills/{userId}")
    public List getSkills(@PathVariable String userId) {
        return restClient.get()
                .uri(talentServiceUrl + "/api/talent/skills/" + userId)
                .retrieve()
                .body(List.class);
    }
}