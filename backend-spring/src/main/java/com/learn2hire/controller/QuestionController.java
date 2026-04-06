package com.learn2hire.controller;

import com.learn2hire.dto.ApiResponse;
import com.learn2hire.model.Question;
import com.learn2hire.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<ApiResponse<Object>> getQuestions(@RequestParam Map<String, String> params) {
        List<Question> questions = questionService.getQuestions(params);
        return ResponseEntity.ok(ApiResponse.success(questions, questions.size()));
    }

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<Object>> getCompanies() {
        return ResponseEntity.ok(ApiResponse.success(questionService.getCompanies()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Object>> getQuestion(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(questionService.getQuestion(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> createQuestion(@RequestBody Question question) {
        Question created = questionService.createQuestion(question);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> updateQuestion(
            @PathVariable String id, @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(ApiResponse.success(questionService.updateQuestion(id, body)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Object>> deleteQuestion(@PathVariable String id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Question deleted"));
    }
}
