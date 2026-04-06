package com.learn2hire.controller;

import com.learn2hire.dto.ApiResponse;
import com.learn2hire.model.Application;
import com.learn2hire.model.User;
import com.learn2hire.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Object>> applyToJob(
            @AuthenticationPrincipal User user, @RequestBody Map<String, String> body) {
        Application app = applicationService.applyToJob(user.getId(), body.get("jobId"), body.get("coverLetter"));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(app, "Application submitted successfully"));
    }

    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Object>> getMyApplications(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getMyApplications(user.getId())));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Object>> getJobApplicants(
            @PathVariable String jobId, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                applicationService.getJobApplicants(jobId, user.getId())));
    }

    @GetMapping("/job/{jobId}/scores")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Object>> getApplicantScores(
            @PathVariable String jobId, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                applicationService.getApplicantScores(jobId, user.getId())));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Object>> updateStatus(
            @PathVariable String id, @AuthenticationPrincipal User user,
            @RequestBody Map<String, String> body) {
        Application app = applicationService.updateApplicationStatus(
                id, user.getId(), body.get("status"), body.get("notes"));
        return ResponseEntity.ok(ApiResponse.success(app, "Application " + body.get("status") + " successfully"));
    }

    @PutMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('CANDIDATE')")
    public ResponseEntity<ApiResponse<Object>> withdraw(
            @PathVariable String id, @AuthenticationPrincipal User user) {
        Application app = applicationService.withdrawApplication(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(app, "Application withdrawn"));
    }
}
