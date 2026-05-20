package com.gummi.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserProxyController {

    private final RestClient restClient;

    @Value("${gummi.services.user-url}")
    private String userServiceUrl;

    public UserProxyController(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    @GetMapping("/profiles/health")
    public Map health() {
        return restClient.get()
                .uri(userServiceUrl + "/api/users/profiles/health")
                .retrieve()
                .body(Map.class);
    }

    @PostMapping("/profiles")
    public Map upsertProfile(@RequestBody Map<String, Object> body) {
        return restClient.post()
                .uri(userServiceUrl + "/api/users/profiles")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);
    }

    @GetMapping("/profiles/{userId}")
    public Map getProfile(@PathVariable String userId) {
        return restClient.get()
                .uri(userServiceUrl + "/api/users/profiles/" + userId)
                .retrieve()
                .body(Map.class);
    }
}