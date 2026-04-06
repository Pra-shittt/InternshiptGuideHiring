package com.learn2hire.service;

import com.learn2hire.exception.AppException;
import com.learn2hire.model.Question;
import com.learn2hire.model.TestAttempt;
import com.learn2hire.repository.QuestionRepository;
import com.learn2hire.repository.TestAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TestService {

    private final QuestionRepository questionRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final MongoTemplate mongoTemplate;

    public Map<String, Object> startTest(String userId, Map<String, Object> body) {
        int count = body.get("count") != null ? ((Number) body.get("count")).intValue() : 10;

        Query query = new Query();
        query.addCriteria(Criteria.where("type").is("MCQ"));

        if (body.get("company") != null) {
            query.addCriteria(Criteria.where("company").regex((String) body.get("company"), "i"));
        }
        if (body.get("topic") != null) {
            query.addCriteria(Criteria.where("topic").regex((String) body.get("topic"), "i"));
        }
        if (body.get("difficulty") != null) {
            query.addCriteria(Criteria.where("difficulty").is(body.get("difficulty")));
        }

        // Use aggregation with $sample for random selection
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(query.getQueryObject().isEmpty() ?
                        Criteria.where("type").is("MCQ") :
                        new Criteria().andOperator(
                                query.getQueryObject().keySet().stream()
                                        .map(k -> Criteria.where(k).is(query.getQueryObject().get(k)))
                                        .toArray(Criteria[]::new)
                        )),
                Aggregation.sample(count),
                Aggregation.project("title", "company", "topic", "difficulty", "type", "questionText", "options")
        );

        List<Question> questions = mongoTemplate.aggregate(aggregation, "questions", Question.class)
                .getMappedResults();

        if (questions.isEmpty()) {
            throw new AppException("No questions found matching criteria", 404);
        }

        String testSessionId = UUID.randomUUID().toString();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("testSessionId", testSessionId);

        // Map questions without correctAnswer
        List<Map<String, Object>> questionList = new ArrayList<>();
        for (Question q : questions) {
            Map<String, Object> qMap = new LinkedHashMap<>();
            qMap.put("_id", q.getId());
            qMap.put("title", q.getTitle());
            qMap.put("company", q.getCompany());
            qMap.put("topic", q.getTopic());
            qMap.put("difficulty", q.getDifficulty());
            qMap.put("type", q.getType());
            qMap.put("questionText", q.getQuestionText());
            qMap.put("options", q.getOptions());
            questionList.add(qMap);
        }

        data.put("questions", questionList);
        data.put("totalQuestions", questions.size());
        data.put("timeLimit", questions.size() * 60);
        return data;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> submitTest(String userId, Map<String, Object> body) {
        String testSessionId = (String) body.get("testSessionId");
        List<Map<String, Object>> answers = (List<Map<String, Object>>) body.get("answers");

        if (testSessionId == null || answers == null) {
            throw new AppException("testSessionId and answers array are required", 400);
        }

        List<String> questionIds = answers.stream()
                .map(a -> (String) a.get("questionId"))
                .collect(Collectors.toList());

        List<Question> questions = questionRepository.findByIdIn(questionIds);
        Map<String, Question> questionMap = new HashMap<>();
        questions.forEach(q -> questionMap.put(q.getId(), q));

        int correctCount = 0;
        List<TestAttempt> attempts = new ArrayList<>();

        for (Map<String, Object> answer : answers) {
            String questionId = (String) answer.get("questionId");
            String selectedAnswer = (String) answer.get("selectedAnswer");
            Question question = questionMap.get(questionId);
            if (question == null) continue;

            boolean isCorrect = "MCQ".equals(question.getType()) &&
                    question.getCorrectAnswer() != null &&
                    question.getCorrectAnswer().equals(selectedAnswer);
            if (isCorrect) correctCount++;

            attempts.add(TestAttempt.builder()
                    .userId(userId)
                    .questionId(questionId)
                    .selectedAnswer(selectedAnswer)
                    .isCorrect(isCorrect)
                    .type(question.getType())
                    .status(selectedAnswer != null ? "SOLVED" : "ATTEMPTED")
                    .score(isCorrect ? 10 : 0)
                    .testSessionId(testSessionId)
                    .build());
        }

        testAttemptRepository.saveAll(attempts);

        int totalScore = correctCount * 10;
        int percentage = Math.round((float) correctCount / answers.size() * 100);

        List<Map<String, Object>> results = new ArrayList<>();
        for (Map<String, Object> a : answers) {
            String qId = (String) a.get("questionId");
            Question q = questionMap.get(qId);
            Map<String, Object> r = new LinkedHashMap<>();
            r.put("questionId", qId);
            r.put("title", q != null ? q.getTitle() : null);
            r.put("selectedAnswer", a.get("selectedAnswer"));
            r.put("correctAnswer", q != null ? q.getCorrectAnswer() : null);
            r.put("isCorrect", q != null && q.getCorrectAnswer() != null &&
                    q.getCorrectAnswer().equals(a.get("selectedAnswer")));
            r.put("explanation", q != null ? q.getExplanation() : null);
            results.add(r);
        }

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("testSessionId", testSessionId);
        data.put("totalQuestions", answers.size());
        data.put("correctAnswers", correctCount);
        data.put("wrongAnswers", answers.size() - correctCount);
        data.put("totalScore", totalScore);
        data.put("percentage", percentage);
        data.put("results", results);
        return data;
    }

    public List<Map<String, Object>> getAttempts(String userId) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("userId").is(userId)),
                Aggregation.group("testSessionId")
                        .count().as("totalQuestions")
                        .sum(ConditionalOperators.when(Criteria.where("isCorrect").is(true))
                                .then(1).otherwise(0)).as("correctAnswers")
                        .sum("score").as("totalScore")
                        .first("createdAt").as("createdAt"),
                Aggregation.sort(Sort.Direction.DESC, "createdAt"),
                Aggregation.project()
                        .and("_id").as("testSessionId")
                        .and("totalQuestions").as("totalQuestions")
                        .and("correctAnswers").as("correctAnswers")
                        .and("totalScore").as("totalScore")
                        .and("createdAt").as("createdAt")
                        .andExpression("round(correctAnswers * 100.0 / totalQuestions)").as("percentage")
        );

        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "testattempts", Map.class);
        List<Map<String, Object>> sessions = new ArrayList<>();
        for (Map raw : results.getMappedResults()) {
            Map<String, Object> session = new LinkedHashMap<>();
            session.put("testSessionId", raw.get("testSessionId"));
            session.put("totalQuestions", raw.get("totalQuestions"));
            session.put("correctAnswers", raw.get("correctAnswers"));
            session.put("totalScore", raw.get("totalScore"));
            session.put("percentage", raw.get("percentage"));
            session.put("createdAt", raw.get("createdAt"));
            sessions.add(session);
        }
        return sessions;
    }
}
