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
@Document(collection = "applications")
@CompoundIndexes({
    @CompoundIndex(name = "job_applicant_unique", def = "{'job': 1, 'applicant': 1}", unique = true),
    @CompoundIndex(name = "applicant_status", def = "{'applicant': 1, 'status': 1}"),
    @CompoundIndex(name = "job_status", def = "{'job': 1, 'status': 1}")
})
public class Application {

    @Id
    @JsonProperty("_id")
    private String id;

    private String job; // Job ID reference

    private String applicant; // User ID reference

    @Builder.Default
    private String status = "applied"; // applied, shortlisted, interview, offered, rejected, withdrawn

    @Builder.Default
    private String coverLetter = "";

    private String resumeUrl;

    @Builder.Default
    private String notes = "";

    private Double assessmentScore;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
