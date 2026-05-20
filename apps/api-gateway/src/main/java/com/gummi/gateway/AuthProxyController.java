package com.gummi.gateway;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthProxyController {

    private final RestClient restClient;

    @Value("${gummi.services.auth-url}")
    private String authServiceUrl;

    public AuthProxyController(RestClient.Builder restClientBuilder) {
        this.restClient = restClientBuilder.build();
    }

    @GetMapping("/health")
    public Map health() {
        return restClient.get()
                .uri(authServiceUrl + "/api/auth/health")
                .retrieve()
                .body(Map.class);
    }

    @PostMapping("/register")
    public Map register(@RequestBody Map<String, Object> body) {
        return restClient.post()
                .uri(authServiceUrl + "/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);
    }

    @PostMapping("/login")
    public Map login(@RequestBody Map<String, Object> body) {
        return restClient.post()
                .uri(authServiceUrl + "/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);
    }
}