package com.learn2hire.service;

import com.learn2hire.exception.AppException;
import com.learn2hire.model.Application;
import com.learn2hire.model.Interview;
import com.learn2hire.model.Job;
import com.learn2hire.model.User;
import com.learn2hire.repository.ApplicationRepository;
import com.learn2hire.repository.InterviewRepository;
import com.learn2hire.repository.JobRepository;
import com.learn2hire.repository.UserRepository;
import com.learn2hire.repository.TestAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecruiterService {

    private final UserRepository userRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final MongoTemplate mongoTemplate;
    private final NotificationService notificationService;

    /**
     * CRITICAL FIX: Schedule interview ONLY if the candidate has applied to one of this recruiter's jobs.
     */
    public Interview scheduleInterview(String recruiterId, String candidateId, String jobId, Date scheduledAt) {
        // 1. Validate candidate exists
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new AppException("Candidate not found", 404));
        if (!"candidate".equals(candidate.getRole())) {
            throw new AppException("User is not a candidate", 400);
        }

        // 2. Validate job exists and belongs to this recruiter
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new AppException("Job not found", 404));
        if (!job.getPostedBy().equals(recruiterId)) {
            throw new AppException("You can only schedule interviews for your own jobs", 403);
        }

        // 3. CRITICAL: Verify the candidate has actually applied to this job
        Optional<Application> application = applicationRepository.findByJobAndApplicant(jobId, candidateId);
        if (application.isEmpty()) {
            throw new AppException("Cannot schedule interview — candidate has not applied to this job", 400);
        }

        // 4. Update application status to 'interview'
        Application app = application.get();
        app.setStatus("interview");
        applicationRepository.save(app);

        // 5. Create interview
        Interview interview = interviewRepository.save(Interview.builder()
                .candidateId(candidateId)
                .recruiterId(recruiterId)
                .jobId(jobId)
                .scheduledAt(scheduledAt)
                .build());

        // 6. Notify candidate
        notificationService.create(
                candidateId,
                "Interview Scheduled",
                "You have an interview for " + job.getTitle() + " at " + job.getCompany(),
                "interview",
                interview.getId()
        );

        return interview;
    }

    public List<Map<String, Object>> getCandidates(String recruiterId) {
        List<Interview> interviews = interviewRepository.findByRecruiterIdOrderByScheduledAtDesc(recruiterId);
        Set<String> candidateIds = interviews.stream().map(Interview::getCandidateId).collect(Collectors.toSet());

        if (candidateIds.isEmpty()) return Collections.emptyList();

        List<User> candidates = userRepository.findByIdIn(new ArrayList<>(candidateIds));
        List<Map<String, Object>> result = new ArrayList<>();

        for (User c : candidates) {
            if (!"candidate".equals(c.getRole())) continue;
            Aggregation agg = Aggregation.newAggregation(
                    Aggregation.match(Criteria.where("userId").is(c.getId())),
                    Aggregation.group().count().as("totalAttempts")
                            .sum(ConditionalOperators.when(Criteria.where("isCorrect").is(true)).then(1).otherwise(0)).as("totalCorrect")
                            .sum("score").as("totalScore"));
            List<Map> stats = mongoTemplate.aggregate(agg, "testattempts", Map.class).getMappedResults();
            Map s = stats.isEmpty() ? Map.of("totalAttempts",0,"totalCorrect",0,"totalScore",0) : stats.get(0);
            int ta=((Number)s.getOrDefault("totalAttempts",0)).intValue();
            int tc=((Number)s.getOrDefault("totalCorrect",0)).intValue();

            Map<String, Object> cd = new LinkedHashMap<>();
            cd.put("id", c.getId()); cd.put("name", c.getName()); cd.put("email", c.getEmail());
            cd.put("resumeUrl", c.getResumeUrl()); cd.put("createdAt", c.getCreatedAt());
            cd.put("interviewStatus", c.getInterviewStatus()); cd.put("skills", c.getSkills());
            cd.put("totalAttempts", ta); cd.put("totalScore", ((Number)s.getOrDefault("totalScore",0)).intValue());
            cd.put("avgScore", ta > 0 ? Math.round((float)tc/ta*100) : 0);
            result.add(cd);
        }
        return result;
    }

    public Map<String, Object> getCandidatePerformance(String recruiterId, String candidateId) {
        // Verify recruiter has access through an application, not just any interview
        List<Job> recruiterJobs = jobRepository.findByPostedByOrderByCreatedAtDesc(recruiterId);
        List<String> jobIds = recruiterJobs.stream().map(Job::getId).collect(Collectors.toList());

        boolean hasApplication = false;
        for (String jobId : jobIds) {
            if (applicationRepository.findByJobAndApplicant(jobId, candidateId).isPresent()) {
                hasApplication = true;
                break;
            }
        }
        if (!hasApplication) {
            throw new AppException("Access denied — this candidate has not applied to any of your jobs", 403);
        }

        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new AppException("Candidate not found", 404));
        if (!"candidate".equals(candidate.getRole())) throw new AppException("Candidate not found", 404);

        Aggregation agg = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("userId").is(candidateId)),
                Aggregation.group("testSessionId").count().as("totalQuestions")
                        .sum(ConditionalOperators.when(Criteria.where("isCorrect").is(true)).then(1).otherwise(0)).as("correctAnswers")
                        .sum("score").as("totalScore").first("createdAt").as("createdAt"),
                Aggregation.sort(Sort.Direction.DESC, "createdAt"));
        List<Map> stats = mongoTemplate.aggregate(agg, "testattempts", Map.class).getMappedResults();

        Map<String, Object> candidateInfo = new LinkedHashMap<>();
        candidateInfo.put("id", candidate.getId()); candidateInfo.put("name", candidate.getName());
        candidateInfo.put("email", candidate.getEmail()); candidateInfo.put("resumeUrl", candidate.getResumeUrl());

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("candidate", candidateInfo); data.put("testHistory", stats);
        return data;
    }

    public List<Map<String, Object>> getInterviews(String recruiterId) {
        List<Interview> interviews = interviewRepository.findByRecruiterIdOrderByScheduledAtDesc(recruiterId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Interview i : interviews) {
            Map<String, Object> iMap = new LinkedHashMap<>();
            iMap.put("_id", i.getId()); iMap.put("candidateId", i.getCandidateId());
            iMap.put("recruiterId", i.getRecruiterId()); iMap.put("jobId", i.getJobId());
            iMap.put("scheduledAt", i.getScheduledAt());
            iMap.put("status", i.getStatus()); iMap.put("result", i.getResult());
            iMap.put("notes", i.getNotes()); iMap.put("rating", i.getRating());
            iMap.put("meetingRoomId", i.getMeetingRoomId());
            iMap.put("createdAt", i.getCreatedAt()); iMap.put("updatedAt", i.getUpdatedAt());

            userRepository.findById(i.getCandidateId()).ifPresent(u -> {
                Map<String, Object> cand = new LinkedHashMap<>();
                cand.put("_id", u.getId()); cand.put("name", u.getName()); cand.put("email", u.getEmail());
                iMap.put("candidateId", cand);
            });

            if (i.getJobId() != null) {
                jobRepository.findById(i.getJobId()).ifPresent(j -> {
                    Map<String, Object> jobMap = new LinkedHashMap<>();
                    jobMap.put("_id", j.getId()); jobMap.put("title", j.getTitle()); jobMap.put("company", j.getCompany());
                    iMap.put("job", jobMap);
                });
            }
            result.add(iMap);
        }
        return result;
    }

    public List<Map<String, Object>> getAllCandidates() {
        List<User> candidates = userRepository.findByRole("candidate");
        return candidates.stream().map(c -> {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", c.getId()); m.put("name", c.getName()); m.put("email", c.getEmail());
            return m;
        }).collect(Collectors.toList());
    }
}
