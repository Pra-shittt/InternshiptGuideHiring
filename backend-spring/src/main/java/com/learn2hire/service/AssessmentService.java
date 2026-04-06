package com.learn2hire.service;

import com.learn2hire.model.Assessment;
import com.learn2hire.repository.AssessmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssessmentService {

    private final AssessmentRepository assessmentRepository;

    public Assessment submitAssessment(String userId, String title, String type, Integer score,
                                        Integer maxScore, String code, String language) {
        Assessment assessment = Assessment.builder()
                .candidateId(userId)
                .title(title)
                .type(type != null ? type : "coding")
                .score(score)
                .maxScore(maxScore != null ? maxScore : 100)
                .code(code != null ? code : "")
                .language(language != null ? language : "javascript")
                .submittedAt(Instant.now())
                .build();
        return assessmentRepository.save(assessment);
    }

    public List<Assessment> getAssessments(String userId) {
        return assessmentRepository.findByCandidateIdOrderBySubmittedAtDesc(userId);
    }

    public List<Assessment> getCandidateAssessments(String candidateId) {
        return assessmentRepository.findByCandidateIdOrderBySubmittedAtDesc(candidateId);
    }
}
