package com.gummi.gateway;

import com.gummi.gateway.security.GatewayJwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/talent")
public class TalentProxyController {

    private final RestClient restClient;
    private final GatewayJwtService gatewayJwtService;

    @Value("${gummi.services.talent-url}")
    private String talentServiceUrl;

    public TalentProxyController(
            RestClient.Builder restClientBuilder,
            GatewayJwtService gatewayJwtService
    ) {
        this.restClient = restClientBuilder.build();
        this.gatewayJwtService = gatewayJwtService;
    }

    @GetMapping("/skills/health")
    public Map health() {
        return restClient.get()
                .uri(talentServiceUrl + "/api/talent/skills/health")
                .retrieve()
                .body(Map.class);
    }

    @PostMapping("/skills")
    public Map addSkill(
            @RequestHeader(
                    value = HttpHeaders.AUTHORIZATION,
                    required = false
            ) String authorizationHeader,
            @RequestBody Map<String, Object> body
    ) {
        String authenticatedUserId =
                gatewayJwtService.requireUserId(authorizationHeader);

        Map<String, Object> authenticatedBody =
                new HashMap<>(body);

        authenticatedBody.put(
                "userId",
                authenticatedUserId
        );

        return restClient.post()
                .uri(talentServiceUrl + "/api/talent/skills")
                .contentType(MediaType.APPLICATION_JSON)
                .body(authenticatedBody)
                .retrieve()
                .body(Map.class);
    }

    @GetMapping("/skills/{userId}")
    public List getSkills(@PathVariable String userId) {
        return restClient.get()
                .uri(
                        talentServiceUrl
                                + "/api/talent/skills/"
                                + userId
                )
                .retrieve()
                .body(List.class);
    }

    @PostMapping("/interests")
    public Map addInterest(
            @RequestHeader(
                    value = HttpHeaders.AUTHORIZATION,
                    required = false
            ) String authorizationHeader,
            @RequestBody Map<String, Object> body
    ) {
        String authenticatedUserId =
                gatewayJwtService.requireUserId(authorizationHeader);

        Map<String, Object> authenticatedBody =
                new HashMap<>(body);

        authenticatedBody.put(
                "userId",
                authenticatedUserId
        );

        return restClient.post()
                .uri(talentServiceUrl + "/api/talent/interests")
                .contentType(MediaType.APPLICATION_JSON)
                .body(authenticatedBody)
                .retrieve()
                .body(Map.class);
    }

    @GetMapping("/interests/{userId}")
    public List getInterests(@PathVariable String userId) {
        return restClient.get()
                .uri(
                        talentServiceUrl
                                + "/api/talent/interests/"
                                + userId
                )
                .retrieve()
                .body(List.class);
    }
}