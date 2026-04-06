package com.learn2hire.service;

import com.learn2hire.exception.AppException;
import com.learn2hire.model.User;
import com.learn2hire.repository.UserRepository;
import com.learn2hire.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    public Map<String, Object> signup(String name, String email, String password, String role) {
        if (name == null || email == null || password == null ||
            name.isBlank() || email.isBlank() || password.isBlank()) {
            throw new AppException("Please provide name, email, and password", 400);
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new AppException("Invalid email address", 400);
        }

        if (password.length() < 6) {
            throw new AppException("Password must be at least 6 characters", 400);
        }

        if (userRepository.existsByEmail(email.toLowerCase().trim())) {
            throw new AppException("Email already registered", 400);
        }

        User user = User.builder()
                .name(name.trim())
                .email(email.toLowerCase().trim())
                .password(passwordEncoder.encode(password))
                .role(role != null ? role : "candidate")
                .build();

        user = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user.getId());

        Map<String, Object> userData = new LinkedHashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("token", token);
        data.put("user", userData);
        return data;
    }

    public Map<String, Object> login(String email, String password) {
        if (email == null || password == null || email.isBlank() || password.isBlank()) {
            throw new AppException("Please provide email and password", 400);
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new AppException("Invalid email address", 400);
        }

        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new AppException("No account found with this email", 401));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AppException("Incorrect password", 401);
        }

        String token = jwtTokenProvider.generateToken(user.getId());

        Map<String, Object> userData = new LinkedHashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("token", token);
        data.put("user", userData);
        return data;
    }

    public Map<String, Object> getMe(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", 404));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("id", user.getId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("role", user.getRole());
        data.put("resumeUrl", user.getResumeUrl());
        data.put("createdAt", user.getCreatedAt());
        return data;
    }
}
