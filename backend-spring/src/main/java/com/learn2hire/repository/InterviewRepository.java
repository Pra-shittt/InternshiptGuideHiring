package com.learn2hire.repository;

import com.learn2hire.model.Interview;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface InterviewRepository extends MongoRepository<Interview, String> {
    List<Interview> findByRecruiterIdOrderByScheduledAtDesc(String recruiterId);
    List<Interview> findByCandidateIdAndStatusInOrderByScheduledAtAsc(String candidateId, List<String> statuses);
    List<String> findDistinctCandidateIdByRecruiterId(String recruiterId);
    boolean existsByRecruiterIdAndCandidateId(String recruiterId, String candidateId);
    Interview findByRecruiterIdAndCandidateId(String recruiterId, String candidateId);
    long countByRecruiterId(String recruiterId);
    long countByRecruiterIdAndResult(String recruiterId, String result);
}
