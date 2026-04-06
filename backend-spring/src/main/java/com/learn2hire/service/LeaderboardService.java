package com.learn2hire.service;

import com.learn2hire.model.*;
import com.learn2hire.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final MongoTemplate mongoTemplate;

    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getLeaderboard() {
        Aggregation agg = Aggregation.newAggregation(
                Aggregation.group("userId")
                        .sum("score").as("totalScore")
                        .count().as("totalAttempts")
                        .sum(ConditionalOperators.when(Criteria.where("isCorrect").is(true)).then(1).otherwise(0)).as("totalCorrect")
                        .addToSet("testSessionId").as("testsTaken"),
                Aggregation.project("totalScore","totalAttempts","totalCorrect")
                        .and(ArrayOperators.Size.lengthOfArray("testsTaken")).as("testCount")
                        .andExpression("round(totalCorrect*100.0/totalAttempts)").as("accuracy"),
                Aggregation.sort(org.springframework.data.domain.Sort.Direction.DESC,"totalScore"),
                Aggregation.limit(50),
                Aggregation.lookup("users","_id","_id","user"),
                Aggregation.unwind("user"),
                Aggregation.project()
                        .and("_id").as("userId").and("user.name").as("name").and("user.email").as("email")
                        .and("totalScore").as("totalScore").and("testCount").as("testCount")
                        .and("accuracy").as("accuracy").and("totalCorrect").as("totalCorrect")
                        .and("totalAttempts").as("totalAttempts")
        );

        List<Map> results = mongoTemplate.aggregate(agg,"testattempts",Map.class).getMappedResults();
        List<Map<String,Object>> leaderboard = new ArrayList<>();
        int rank = 1;
        for (Map r : results) {
            Map<String,Object> entry = new LinkedHashMap<>();
            entry.put("rank", rank++);
            entry.put("userId", r.get("userId")); entry.put("name", r.get("name"));
            entry.put("email", r.get("email")); entry.put("totalScore", r.get("totalScore"));
            entry.put("testCount", r.get("testCount")); entry.put("accuracy", r.get("accuracy"));
            entry.put("totalCorrect", r.get("totalCorrect")); entry.put("totalAttempts", r.get("totalAttempts"));
            leaderboard.add(entry);
        }
        return leaderboard;
    }
}
