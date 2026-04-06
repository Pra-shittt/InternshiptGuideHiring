package com.learn2hire.controller;

import com.learn2hire.dto.ApiResponse;
import com.learn2hire.model.Interview;
import com.learn2hire.model.User;
import com.learn2hire.service.RecruiterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;

@RestController
@RequestMapping("/api/recruiter")
@RequiredArgsConstructor
@PreAuthorize("hasRole('RECRUITER')")
public class RecruiterController {

    private final RecruiterService recruiterService;

    @GetMapping("/candidates")
    public ResponseEntity<ApiResponse<Object>> getCandidates(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(recruiterService.getCandidates(user.getId())));
    }

    @GetMapping("/all-candidates")
    public ResponseEntity<ApiResponse<Object>> getAllCandidates() {
        return ResponseEntity.ok(ApiResponse.success(recruiterService.getAllCandidates()));
    }

    @GetMapping("/candidates/{id}")
    public ResponseEntity<ApiResponse<Object>> getCandidatePerformance(
            @PathVariable String id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(
                recruiterService.getCandidatePerformance(user.getId(), id)));
    }

    @PostMapping("/interviews")
    public ResponseEntity<ApiResponse<Object>> scheduleInterview(
            @AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        String candidateId = (String) body.get("candidateId");
        String jobId = (String) body.get("jobId");
        Object scheduledAtObj = body.get("scheduledAt");

        Date date;
        if (scheduledAtObj instanceof String) {
            try {
                date = new java.text.SimpleDateFormat("yyyy-MM-dd'T'HH:mm").parse((String) scheduledAtObj);
            } catch (Exception e) {
                date = new Date();
            }
        } else {
            date = new Date();
        }

        Interview interview = recruiterService.scheduleInterview(user.getId(), candidateId, jobId, date);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(interview, "Interview scheduled successfully"));
    }

    @GetMapping("/interviews")
    public ResponseEntity<ApiResponse<Object>> getInterviews(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(recruiterService.getInterviews(user.getId())));
    }
}
