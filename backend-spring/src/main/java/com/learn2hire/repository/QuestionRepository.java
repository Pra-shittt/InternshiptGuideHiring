package com.learn2hire.repository;

import com.learn2hire.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByType(String type);
    List<Question> findByIdIn(List<String> ids);
}
