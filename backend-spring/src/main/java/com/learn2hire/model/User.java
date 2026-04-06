package com.learn2hire.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    @JsonProperty("_id")
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password;

    @Builder.Default
    private String role = "candidate"; // candidate, recruiter, admin

    @Builder.Default
    private List<String> skills = new ArrayList<>();

    private String company;

    private String phone;

    @Builder.Default
    private String interviewStatus = "available"; // available, in-interview, hired, rejected

    private String resumeUrl;

    @Builder.Default
    private List<String> solvedQuestions = new ArrayList<>();

    @Builder.Default
    private String bio = "";

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
