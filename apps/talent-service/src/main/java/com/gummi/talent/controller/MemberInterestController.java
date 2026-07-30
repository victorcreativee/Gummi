package com.gummi.talent.controller;

import com.gummi.talent.dto.AddInterestRequest;
import com.gummi.talent.model.MemberInterest;
import com.gummi.talent.service.MemberInterestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/talent/interests")
public class MemberInterestController {

    private final MemberInterestService memberInterestService;

    public MemberInterestController(
            MemberInterestService memberInterestService
    ) {
        this.memberInterestService = memberInterestService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MemberInterest addInterest(
            @Valid @RequestBody AddInterestRequest request
    ) {
        return memberInterestService.addInterest(request);
    }

    @GetMapping("/{userId}")
    public List<MemberInterest> getInterests(
            @PathVariable UUID userId
    ) {
        return memberInterestService.getInterests(userId);
    }
}