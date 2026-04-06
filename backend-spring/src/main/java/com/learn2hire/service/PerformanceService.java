package com.learn2hire.service;

import com.learn2hire.repository.TestAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class PerformanceService {

    private final TestAttemptRepository testAttemptRepository;
    private final MongoTemplate mongoTemplate;

    @SuppressWarnings("unchecked")
    public Map<String, Object> getPerformanceSummary(String userId) {
        // Total tests
        Aggregation sessionAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("userId").is(userId)),
                Aggregation.group("testSessionId"));
        long totalTests = mongoTemplate.aggregate(sessionAgg, "testattempts", Map.class).getMappedResults().size();

        // Overall stats
        Aggregation overallAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("userId").is(userId)),
                Aggregation.group().count().as("totalAttempts")
                        .sum(ConditionalOperators.when(Criteria.where("isCorrect").is(true)).then(1).otherwise(0)).as("totalCorrect")
                        .sum("score").as("totalScore"));
        List<Map> overallRes = mongoTemplate.aggregate(overallAgg, "testattempts", Map.class).getMappedResults();
        Map ov = overallRes.isEmpty() ? Map.of("totalAttempts",0,"totalCorrect",0,"totalScore",0) : overallRes.get(0);
        int ta = ((Number)ov.getOrDefault("totalAttempts",0)).intValue();
        int tc = ((Number)ov.getOrDefault("totalCorrect",0)).intValue();
        int ts = ((Number)ov.getOrDefault("totalScore",0)).intValue();
        int avg = ta > 0 ? Math.round((float)tc/ta*100) : 0;

        // Topic stats
        Aggregation topicAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("userId").is(userId)),
                Aggregation.lookup("questions","questionId","_id","question"),
                Aggregation.unwind("question"),
                Aggregation.group("question.topic").count().as("total")
                        .sum(ConditionalOperators.when(Criteria.where("isCorrect").is(true)).then(1).otherwise(0)).as("correct"),
                Aggregation.project().and("_id").as("topic").and("total").as("total").and("correct").as("correct")
                        .andExpression("round(correct*100.0/total)").as("accuracy"),
                Aggregation.sort(Sort.Direction.ASC,"accuracy"));
        List<Map> topicRes = mongoTemplate.aggregate(topicAgg,"testattempts",Map.class).getMappedResults();
        List<Map<String,Object>> topicStats=new ArrayList<>(), weak=new ArrayList<>(), strong=new ArrayList<>();
        for(Map r:topicRes){
            Map<String,Object> t=new LinkedHashMap<>();
            t.put("topic",r.get("topic")); t.put("total",r.get("total"));
            t.put("correct",r.get("correct")); t.put("accuracy",r.get("accuracy"));
            topicStats.add(t);
            if(((Number)r.getOrDefault("accuracy",0)).intValue()<60) weak.add(t); else strong.add(t);
        }
        strong.sort((a,b)->((Number)b.get("accuracy")).intValue()-((Number)a.get("accuracy")).intValue());

        // Recent activity
        Aggregation recentAgg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("userId").is(userId)),
                Aggregation.group("testSessionId").count().as("totalQuestions")
                        .sum(ConditionalOperators.when(Criteria.where("isCorrect").is(true)).then(1).otherwise(0)).as("correctAnswers")
                        .sum("score").as("totalScore").first("createdAt").as("createdAt"),
                Aggregation.sort(Sort.Direction.DESC,"createdAt"), Aggregation.limit(10),
                Aggregation.project().and("_id").as("testSessionId").and("totalQuestions").as("totalQuestions")
                        .and("correctAnswers").as("correctAnswers").and("totalScore").as("totalScore")
                        .and("createdAt").as("createdAt").andExpression("round(correctAnswers*100.0/totalQuestions)").as("percentage"));
        List<Map> recentRes = mongoTemplate.aggregate(recentAgg,"testattempts",Map.class).getMappedResults();
        List<Map<String,Object>> recent=new ArrayList<>();
        for(Map r:recentRes){
            Map<String,Object> a=new LinkedHashMap<>();
            a.put("testSessionId",r.get("testSessionId")); a.put("totalQuestions",r.get("totalQuestions"));
            a.put("correctAnswers",r.get("correctAnswers")); a.put("totalScore",r.get("totalScore"));
            a.put("percentage",r.get("percentage")); a.put("createdAt",r.get("createdAt"));
            recent.add(a);
        }

        Map<String,Object> data=new LinkedHashMap<>();
        data.put("totalTests",totalTests); data.put("totalScore",ts); data.put("avgScore",avg);
        data.put("topicStats",topicStats); data.put("weakTopics",weak); data.put("strongTopics",strong);
        data.put("recentActivity",recent);
        return data;
    }
}
