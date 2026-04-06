package com.learn2hire.service;

import com.learn2hire.model.Question;
import com.learn2hire.repository.QuestionRepository;
import com.learn2hire.exception.AppException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final MongoTemplate mongoTemplate;

    public List<Question> getQuestions(Map<String, String> params) {
        Query query = new Query();

        if (params.get("company") != null) {
            query.addCriteria(Criteria.where("company").regex(params.get("company"), "i"));
        }
        if (params.get("topic") != null) {
            query.addCriteria(Criteria.where("topic").regex(params.get("topic"), "i"));
        }
        if (params.get("difficulty") != null) {
            query.addCriteria(Criteria.where("difficulty").is(params.get("difficulty")));
        }
        if (params.get("type") != null) {
            query.addCriteria(Criteria.where("type").is(params.get("type")));
        }
        if (params.get("search") != null) {
            String search = params.get("search");
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("title").regex(search, "i"),
                    Criteria.where("company").regex(search, "i"),
                    Criteria.where("topic").regex(search, "i")
            ));
        }

        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));
        return mongoTemplate.find(query, Question.class);
    }

    public List<Map<String, Object>> getCompanies() {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("company").count().as("count"),
                Aggregation.sort(Sort.Direction.DESC, "count"),
                Aggregation.project().and("_id").as("name").and("count").as("count")
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "questions", Map.class);
        List<Map<String, Object>> companies = new ArrayList<>();
        for (Map raw : results.getMappedResults()) {
            Map<String, Object> company = new LinkedHashMap<>();
            company.put("name", raw.get("name"));
            company.put("count", raw.get("count"));
            companies.add(company);
        }
        return companies;
    }

    public Question getQuestion(String id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new AppException("Question not found", 404));
    }

    public Question createQuestion(Question question) {
        return questionRepository.save(question);
    }

    public Question updateQuestion(String id, Map<String, Object> updates) {
        Question question = questionRepository.findById(id)
                .orElseThrow(() -> new AppException("Question not found", 404));

        if (updates.containsKey("title")) question.setTitle((String) updates.get("title"));
        if (updates.containsKey("company")) question.setCompany((String) updates.get("company"));
        if (updates.containsKey("topic")) question.setTopic((String) updates.get("topic"));
        if (updates.containsKey("difficulty")) question.setDifficulty((String) updates.get("difficulty"));
        if (updates.containsKey("type")) question.setType((String) updates.get("type"));
        if (updates.containsKey("questionText")) question.setQuestionText((String) updates.get("questionText"));
        if (updates.containsKey("correctAnswer")) question.setCorrectAnswer((String) updates.get("correctAnswer"));
        if (updates.containsKey("explanation")) question.setExplanation((String) updates.get("explanation"));
        if (updates.containsKey("description")) question.setDescription((String) updates.get("description"));
        if (updates.containsKey("platform")) question.setPlatform((String) updates.get("platform"));
        if (updates.containsKey("link")) question.setLink((String) updates.get("link"));
        if (updates.containsKey("options")) {
            @SuppressWarnings("unchecked")
            List<String> options = (List<String>) updates.get("options");
            question.setOptions(options);
        }
        if (updates.containsKey("companyTags")) {
            @SuppressWarnings("unchecked")
            List<String> tags = (List<String>) updates.get("companyTags");
            question.setCompanyTags(tags);
        }

        return questionRepository.save(question);
    }

    public void deleteQuestion(String id) {
        if (!questionRepository.existsById(id)) {
            throw new AppException("Question not found", 404);
        }
        questionRepository.deleteById(id);
    }
}
