package com.learn2hire.service;

import com.learn2hire.exception.AppException;
import com.learn2hire.model.Question;
import com.learn2hire.model.User;
import com.learn2hire.repository.QuestionRepository;
import com.learn2hire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;

    public Map<String, Object> getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", 404));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("_id", user.getId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("role", user.getRole());
        data.put("skills", user.getSkills());
        data.put("company", user.getCompany());
        data.put("phone", user.getPhone());
        data.put("resumeUrl", user.getResumeUrl());
        data.put("interviewStatus", user.getInterviewStatus());
        data.put("createdAt", user.getCreatedAt());
        return data;
    }

    public Map<String, Object> updateProfile(String userId, Map<String, Object> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", 404));

        List<String> allowedFields = Arrays.asList("name", "phone", "skills", "resumeUrl", "company");
        boolean hasUpdate = false;

        for (String field : allowedFields) {
            if (updates.containsKey(field)) {
                hasUpdate = true;
                switch (field) {
                    case "name" -> user.setName((String) updates.get(field));
                    case "phone" -> user.setPhone((String) updates.get(field));
                    case "skills" -> {
                        @SuppressWarnings("unchecked")
                        List<String> skills = (List<String>) updates.get(field);
                        user.setSkills(skills);
                    }
                    case "resumeUrl" -> user.setResumeUrl((String) updates.get(field));
                    case "company" -> user.setCompany((String) updates.get(field));
                }
            }
        }

        if (!hasUpdate) {
            throw new AppException("No valid fields to update", 400);
        }

        user = userRepository.save(user);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("_id", user.getId());
        data.put("name", user.getName());
        data.put("email", user.getEmail());
        data.put("role", user.getRole());
        data.put("skills", user.getSkills());
        data.put("company", user.getCompany());
        data.put("phone", user.getPhone());
        data.put("resumeUrl", user.getResumeUrl());
        data.put("interviewStatus", user.getInterviewStatus());
        return data;
    }

    public Map<String, Object> saveSolvedQuestion(String userId, String questionId) {
        if (questionId == null || questionId.isBlank()) {
            throw new AppException("questionId is required", 400);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", 404));

        if (user.getSolvedQuestions() == null) {
            user.setSolvedQuestions(new ArrayList<>());
        }

        if (user.getSolvedQuestions().contains(questionId)) {
            throw new AppException("Question already marked as solved", 400);
        }

        user.getSolvedQuestions().add(questionId);
        user = userRepository.save(user);

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("solvedQuestions", user.getSolvedQuestions());
        return data;
    }

    public Object getSolvedQuestions(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", 404));

        if (user.getSolvedQuestions() == null || user.getSolvedQuestions().isEmpty()) {
            return Collections.emptyList();
        }

        // Populate questions with selected fields
        List<Question> questions = questionRepository.findByIdIn(user.getSolvedQuestions());
        List<Map<String, Object>> result = new ArrayList<>();
        for (Question q : questions) {
            Map<String, Object> qMap = new LinkedHashMap<>();
            qMap.put("_id", q.getId());
            qMap.put("title", q.getTitle());
            qMap.put("difficulty", q.getDifficulty());
            qMap.put("topic", q.getTopic());
            qMap.put("company", q.getCompany());
            result.add(qMap);
        }
        return result;
    }
}
