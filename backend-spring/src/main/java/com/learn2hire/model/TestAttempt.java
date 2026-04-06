package com.learn2hire.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "testattempts")
@CompoundIndexes({
    @CompoundIndex(name = "userId_testSessionId", def = "{'userId': 1, 'testSessionId': 1}"),
    @CompoundIndex(name = "userId_createdAt", def = "{'userId': 1, 'createdAt': -1}")
})
public class TestAttempt {

    @Id
    @JsonProperty("_id")
    private String id;

    private String userId; // User ID reference

    private String questionId; // Question ID reference

    private String selectedAnswer;

    @Builder.Default
    private Boolean isCorrect = false;

    private String type; // MCQ, CODING

    @Builder.Default
    private String status = "ATTEMPTED"; // SOLVED, ATTEMPTED

    @Builder.Default
    private Integer score = 0;

    private String testSessionId;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
