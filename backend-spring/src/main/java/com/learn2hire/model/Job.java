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
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "jobs")
@CompoundIndexes({
    @CompoundIndex(name = "postedBy_status", def = "{'postedBy': 1, 'status': 1}"),
    @CompoundIndex(name = "company_idx", def = "{'company': 1}"),
    @CompoundIndex(name = "status_createdAt", def = "{'status': 1, 'createdAt': -1}")
})
public class Job {

    @Id
    @JsonProperty("_id")
    private String id;

    private String postedBy; // User ID reference

    private String title;

    private String description;

    private String company;

    @Builder.Default
    private String location = "Remote";

    @Builder.Default
    private String type = "Full-Time"; // Full-Time, Part-Time, Internship, Contract

    @Builder.Default
    private List<String> skills = new ArrayList<>();

    private String salary;

    @Builder.Default
    private Integer openings = 1;

    @Builder.Default
    private String status = "open"; // open, closed, draft

    private Date deadline;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
