package com.learn2hire.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "assessments")
@CompoundIndex(name = "candidateId_submittedAt", def = "{'candidateId': 1, 'submittedAt': -1}")
public class Assessment {

    @Id
    @JsonProperty("_id")
    private String id;

    private String candidateId; // User ID reference

    private String title;

    @Builder.Default
    private String type = "coding"; // coding, mcq

    private Integer score;

    @Builder.Default
    private Integer maxScore = 100;

    @Builder.Default
    private String code = "";

    @Builder.Default
    private String language = "javascript";

    @Builder.Default
    private Instant submittedAt = Instant.now();

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
