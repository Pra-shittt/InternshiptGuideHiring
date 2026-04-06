package com.learn2hire.repository;

import com.learn2hire.model.Job;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findByStatusOrderByCreatedAtDesc(String status);
    List<Job> findByPostedByOrderByCreatedAtDesc(String postedBy);
    List<Job> findByPostedBy(String postedBy);
}
