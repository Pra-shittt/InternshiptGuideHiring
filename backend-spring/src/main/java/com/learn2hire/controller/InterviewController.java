package com.learn2hire.controller;

import com.learn2hire.dto.ApiResponse;
import com.learn2hire.model.User;
import com.learn2hire.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @GetMapping("/candidate/upcoming")
    public ResponseEntity<ApiResponse<Object>> getCandidateInterviews(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(interviewService.getCandidateInterviews(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getInterviewById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(interviewService.getInterviewById(id)));
    }

    @PostMapping("/{id}/start")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Object>> startInterview(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(interviewService.startInterview(id)));
    }

    @PutMapping("/{id}/notes")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Object>> saveNotes(
            @PathVariable String id, @RequestBody Map<String, Object> body) {
        Integer rating = body.get("rating") != null ? ((Number) body.get("rating")).intValue() : null;
        return ResponseEntity.ok(ApiResponse.success(
                interviewService.saveNotes(id, (String) body.get("notes"), rating)));
    }

    @PutMapping("/{id}/end")
    @PreAuthorize("hasRole('RECRUITER')")
    public ResponseEntity<ApiResponse<Object>> endInterview(
            @PathVariable String id, @RequestBody Map<String, Object> body) {
        Integer rating = body.get("rating") != null ? ((Number) body.get("rating")).intValue() : null;
        return ResponseEntity.ok(ApiResponse.success(
                interviewService.endInterview(id, (String) body.get("result"),
                        (String) body.get("notes"), rating)));
    }
}
