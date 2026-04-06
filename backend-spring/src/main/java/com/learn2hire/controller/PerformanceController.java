package com.learn2hire.controller;

import com.learn2hire.dto.ApiResponse;
import com.learn2hire.model.User;
import com.learn2hire.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
public class PerformanceController {

    private final PerformanceService performanceService;

    @GetMapping("/summary")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Object>> getSummary(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(performanceService.getPerformanceSummary(user.getId())));
    }
}
