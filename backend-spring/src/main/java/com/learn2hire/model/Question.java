package com.learn2hire.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "questions")
@CompoundIndex(name = "company_topic_difficulty_type", def = "{'company': 1, 'topic': 1, 'difficulty': 1, 'type': 1}")
public class Question {

    @Id
    @JsonProperty("_id")
    private String id;

    private String title;

    private String company;

    private String topic;

    private String difficulty; // Easy, Medium, Hard

    private String type; // MCQ, CODING

    // MCQ-specific fields
    private String questionText;

    @Builder.Default
    private List<String> options = new ArrayList<>();

    private String correctAnswer;

    private String explanation;

    @Builder.Default
    private String description = "";

    @Builder.Default
    private List<String> companyTags = new ArrayList<>();

    // CODING-specific fields
    private String platform; // LeetCode, GFG, CodeChef

    private String link;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
