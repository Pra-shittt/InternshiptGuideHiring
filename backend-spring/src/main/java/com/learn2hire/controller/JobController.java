package com.learn2hire.controller;

import com.learn2hire.dto.ApiResponse;
import com.learn2hire.model.Job;
import com.learn2hire.model.User;
import com.learn2hire.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getJobs(@RequestParam Map<String, String> params) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getJobs(params)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Object>> createJob(
            @AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        Job job = jobService.createJob(user.getId(), body);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(job, "Job created successfully"));
    }

    @GetMapping("/my-jobs")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Object>> getMyJobs(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getMyJobs(user.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getJobById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(jobService.getJobById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Object>> updateJob(
            @PathVariable String id, @AuthenticationPrincipal User user,
            @RequestBody Map<String, Object> body) {
        Job job = jobService.updateJob(id, user.getId(), body);
        return ResponseEntity.ok(ApiResponse.success(job, "Job updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteJob(
            @PathVariable String id, @AuthenticationPrincipal User user) {
        jobService.deleteJob(id, user.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Job and related applications deleted"));
    }
}
