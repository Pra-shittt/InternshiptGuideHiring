package com.learn2hire.controller;

import com.learn2hire.dto.ApiResponse;
import com.learn2hire.model.User;
import com.learn2hire.repository.UserRepository;
import com.learn2hire.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Object>> getProfile(@AuthenticationPrincipal User user) {
        User u = userRepository.findById(user.getId())
                .orElseThrow(() -> new AppException("User not found", 404));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("id", u.getId());
        data.put("name", u.getName());
        data.put("email", u.getEmail());
        data.put("role", u.getRole());
        data.put("phone", u.getPhone());
        data.put("bio", u.getBio());
        data.put("skills", u.getSkills());
        data.put("resumeUrl", u.getResumeUrl());
        data.put("company", u.getCompany());
        data.put("createdAt", u.getCreatedAt());

        return ResponseEntity.ok(ApiResponse.success(data));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<Object>> updateProfile(
            @AuthenticationPrincipal User user, @RequestBody Map<String, Object> body) {
        User u = userRepository.findById(user.getId())
                .orElseThrow(() -> new AppException("User not found", 404));

        if (body.containsKey("name")) u.setName((String) body.get("name"));
        if (body.containsKey("phone")) u.setPhone((String) body.get("phone"));
        if (body.containsKey("bio")) u.setBio((String) body.get("bio"));
        if (body.containsKey("company")) u.setCompany((String) body.get("company"));
        if (body.containsKey("skills")) {
            @SuppressWarnings("unchecked")
            List<String> skills = (List<String>) body.get("skills");
            u.setSkills(skills);
        }

        userRepository.save(u);
        return ResponseEntity.ok(ApiResponse.success(null, "Profile updated"));
    }
}
