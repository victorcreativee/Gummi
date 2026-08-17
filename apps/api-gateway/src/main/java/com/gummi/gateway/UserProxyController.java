package com.gummi.gateway;

import com.gummi.gateway.security.GatewayJwtService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserProxyController {

    private final RestClient restClient;
    private final GatewayJwtService gatewayJwtService;

    @Value("${gummi.services.user-url}")
    private String userServiceUrl;

    public UserProxyController(
            RestClient.Builder restClientBuilder,
            GatewayJwtService gatewayJwtService
    ) {
        this.restClient = restClientBuilder.build();
        this.gatewayJwtService = gatewayJwtService;
    }

    @GetMapping("/profiles/health")
    public Map health() {
        return restClient.get()
                .uri(userServiceUrl + "/api/users/profiles/health")
                .retrieve()
                .body(Map.class);
    }

    @PostMapping("/profiles")
    public Map upsertProfile(
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
                .uri(userServiceUrl + "/api/users/profiles")
                .contentType(MediaType.APPLICATION_JSON)
                .body(authenticatedBody)
                .retrieve()
                .body(Map.class);
    }

    @GetMapping("/profiles/{userId}")
    public Map getProfile(@PathVariable String userId) {
        return restClient.get()
                .uri(
                        userServiceUrl
                                + "/api/users/profiles/"
                                + userId
                )
                .retrieve()
                .body(Map.class);
    }
    @PostMapping("/onboarding/goal")
    public Map saveOnboardingGoal(
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
                .uri(userServiceUrl + "/api/users/onboarding/goal")
                .contentType(MediaType.APPLICATION_JSON)
                .body(authenticatedBody)
                .retrieve()
                .body(Map.class);
    }

    @PostMapping("/onboarding/complete")
    public Map completeOnboarding(
            @RequestHeader(
                    value = HttpHeaders.AUTHORIZATION,
                    required = false
            ) String authorizationHeader
    ) {
        String authenticatedUserId =
                gatewayJwtService.requireUserId(authorizationHeader);

        Map<String, Object> authenticatedBody = Map.of(
                "userId",
                authenticatedUserId
        );

        return restClient.post()
                .uri(userServiceUrl + "/api/users/onboarding/complete")
                .contentType(MediaType.APPLICATION_JSON)
                .body(authenticatedBody)
                .retrieve()
                .body(Map.class);
    }

    @GetMapping("/onboarding/me")
    public ResponseEntity<Map> getMyOnboarding(
            @RequestHeader(
                    value = HttpHeaders.AUTHORIZATION,
                    required = false
            ) String authorizationHeader
    ) {
        String authenticatedUserId =
                gatewayJwtService.requireUserId(authorizationHeader);

        ResponseEntity<Map> response = restClient.get()
                .uri(
                        userServiceUrl
                                + "/api/users/onboarding/"
                                + authenticatedUserId
                )
                .retrieve()
                .toEntity(Map.class);

        return ResponseEntity
                .status(response.getStatusCode())
                .body(response.getBody());
    }
}
