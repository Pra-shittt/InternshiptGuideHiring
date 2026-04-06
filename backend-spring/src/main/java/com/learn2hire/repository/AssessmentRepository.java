package com.learn2hire.repository;

import com.learn2hire.model.Assessment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AssessmentRepository extends MongoRepository<Assessment, String> {
    List<Assessment> findByCandidateIdOrderBySubmittedAtDesc(String candidateId);
}
