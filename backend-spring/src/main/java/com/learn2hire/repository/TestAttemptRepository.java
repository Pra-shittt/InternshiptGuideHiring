package com.learn2hire.repository;

import com.learn2hire.model.TestAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TestAttemptRepository extends MongoRepository<TestAttempt, String> {
    List<TestAttempt> findByUserId(String userId);
    List<TestAttempt> findByUserIdOrderByCreatedAtDesc(String userId);
    List<TestAttempt> findByUserIdAndTestSessionId(String userId, String testSessionId);
}
