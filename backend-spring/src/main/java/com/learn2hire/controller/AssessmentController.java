package com.learn2hire.controller;

import com.learn2hire.dto.ApiResponse;
import com.learn2hire.model.Assessment;
import com.learn2hire.model.User;
import com.learn2hire.service.AssessmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/assessments")
@RequiredArgsConstructor
public class AssessmentController {

    private final AssessmentService assessmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<Object>> submitAssessment(
            @AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        Assessment assessment = assessmentService.submitAssessment(
                user.getId(), (String) body.get("title"), (String) body.get("type"),
                body.get("score") != null ? ((Number) body.get("score")).intValue() : 0,
                body.get("maxScore") != null ? ((Number) body.get("maxScore")).intValue() : null,
                (String) body.get("code"), (String) body.get("language"));
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(assessment));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getAssessments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(assessmentService.getAssessments(user.getId())));
    }

    @GetMapping("/candidate/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Object>> getCandidateAssessments(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(assessmentService.getCandidateAssessments(id)));
    }
}
