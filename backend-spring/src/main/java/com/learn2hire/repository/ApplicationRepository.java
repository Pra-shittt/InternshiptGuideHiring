package com.learn2hire.repository;

import com.learn2hire.model.Application;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends MongoRepository<Application, String> {
    Optional<Application> findByJobAndApplicant(String job, String applicant);
    List<Application> findByApplicantOrderByCreatedAtDesc(String applicant);
    List<Application> findByJobOrderByCreatedAtDesc(String job);
    List<Application> findByJob(String job);
    List<Application> findByJobIn(List<String> jobIds);
    void deleteByJob(String job);
    long countByJob(String job);
}
