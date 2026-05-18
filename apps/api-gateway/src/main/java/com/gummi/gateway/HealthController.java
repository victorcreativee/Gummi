package com.gummi.gateway;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public Map<String, Object> health() {
        return Map.of(
                "success", true,
                "service", "api-gateway",
                "status", "healthy",
                "message", "GUMMI API Gateway is alive",
                "timestamp", Instant.now().toString()
        );
    }
}