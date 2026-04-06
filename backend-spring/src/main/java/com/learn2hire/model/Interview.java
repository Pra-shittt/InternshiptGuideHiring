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
import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "interviews")
@CompoundIndexes({
    @CompoundIndex(name = "recruiter_scheduledAt", def = "{'recruiterId': 1, 'scheduledAt': -1}"),
    @CompoundIndex(name = "candidate_scheduledAt", def = "{'candidateId': 1, 'scheduledAt': -1}")
})
public class Interview {

    @Id
    @JsonProperty("_id")
    private String id;

    private String candidateId; // User ID reference

    private String recruiterId; // User ID reference

    private String jobId; // Job ID reference — links interview to specific job/application

    private Date scheduledAt;

    private String meetingRoomId;

    @Builder.Default
    private String notes = "";

    private Integer rating; // 1-5

    @Builder.Default
    private String result = "pending"; // pending, selected, rejected

    @Builder.Default
    private String status = "SCHEDULED"; // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
