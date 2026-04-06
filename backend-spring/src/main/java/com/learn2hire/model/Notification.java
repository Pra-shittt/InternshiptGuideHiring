package com.learn2hire.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {

    @Id
    @JsonProperty("_id")
    private String id;

    @Indexed
    private String userId;

    private String title;

    private String message;

    @Builder.Default
    private String type = "info"; // info, interview, application, test

    private String relatedId; // jobId, interviewId, etc.

    @Builder.Default
    private boolean isRead = false;

    @CreatedDate
    private Instant createdAt;
}
