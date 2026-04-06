package com.learn2hire.controller;

import com.learn2hire.dto.ApiResponse;
import com.learn2hire.model.User;
import com.learn2hire.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Object>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<Object>> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getUsers(role, search)));
    }

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<Object>> getCompanies() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getCompanies()));
    }

    @PostMapping("/companies")
    public ResponseEntity<ApiResponse<Object>> createCompany(@RequestBody Map<String, String> body) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                adminService.createCompany(body.get("name"), body.get("description"),
                        body.get("industry"), body.get("website"))));
    }

    @PutMapping("/companies/{id}")
    public ResponseEntity<ApiResponse<Object>> updateCompany(
            @PathVariable String id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(adminService.updateCompany(id, body)));
    }

    @DeleteMapping("/companies/{id}")
    public ResponseEntity<ApiResponse<Object>> deleteCompany(@PathVariable String id) {
        adminService.deleteCompany(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Company deleted"));
    }
}
