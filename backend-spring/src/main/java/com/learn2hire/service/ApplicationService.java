package com.learn2hire.service;

import com.learn2hire.exception.AppException;
import com.learn2hire.model.Application;
import com.learn2hire.model.Job;
import com.learn2hire.model.User;
import com.learn2hire.repository.ApplicationRepository;
import com.learn2hire.repository.JobRepository;
import com.learn2hire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    public Application applyToJob(String userId, String jobId, String coverLetter) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new AppException("Job not found", 404));

        if (!"open".equals(job.getStatus())) {
            throw new AppException("This job is no longer accepting applications", 400);
        }

        applicationRepository.findByJobAndApplicant(jobId, userId)
                .ifPresent(a -> { throw new AppException("You have already applied to this job", 400); });

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", 404));

        Application application = Application.builder()
                .job(jobId)
                .applicant(userId)
                .coverLetter(coverLetter != null ? coverLetter : "")
                .resumeUrl(user.getResumeUrl())
                .build();

        return applicationRepository.save(application);
    }

    public List<Map<String, Object>> getMyApplications(String userId) {
        List<Application> applications = applicationRepository.findByApplicantOrderByCreatedAtDesc(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Application app : applications) {
            Map<String, Object> appMap = applicationToMap(app);

            // Populate job with nested postedBy
            jobRepository.findById(app.getJob()).ifPresent(job -> {
                Map<String, Object> jobMap = new LinkedHashMap<>();
                jobMap.put("_id", job.getId());
                jobMap.put("title", job.getTitle());
                jobMap.put("company", job.getCompany());
                jobMap.put("location", job.getLocation());
                jobMap.put("type", job.getType());
                jobMap.put("status", job.getStatus());
                jobMap.put("salary", job.getSalary());

                userRepository.findById(job.getPostedBy()).ifPresent(u -> {
                    Map<String, Object> postedBy = new LinkedHashMap<>();
                    postedBy.put("_id", u.getId());
                    postedBy.put("name", u.getName());
                    jobMap.put("postedBy", postedBy);
                });

                appMap.put("job", jobMap);
            });
            result.add(appMap);
        }
        return result;
    }

    public List<Map<String, Object>> getJobApplicants(String jobId, String recruiterId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new AppException("Job not found", 404));

        if (!job.getPostedBy().equals(recruiterId)) {
            throw new AppException("Not authorized to view applicants for this job", 403);
        }

        List<Application> applications = applicationRepository.findByJobOrderByCreatedAtDesc(jobId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Application app : applications) {
            Map<String, Object> appMap = applicationToMap(app);

            userRepository.findById(app.getApplicant()).ifPresent(u -> {
                Map<String, Object> applicant = new LinkedHashMap<>();
                applicant.put("_id", u.getId());
                applicant.put("name", u.getName());
                applicant.put("email", u.getEmail());
                applicant.put("skills", u.getSkills());
                applicant.put("resumeUrl", u.getResumeUrl());
                applicant.put("interviewStatus", u.getInterviewStatus());
                applicant.put("phone", u.getPhone());
                appMap.put("applicant", applicant);
            });
            result.add(appMap);
        }
        return result;
    }

    public Application updateApplicationStatus(String id, String recruiterId, String status, String notes) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new AppException("Application not found", 404));

        Job job = jobRepository.findById(application.getJob())
                .orElseThrow(() -> new AppException("Job not found", 404));

        if (!job.getPostedBy().equals(recruiterId)) {
            throw new AppException("Not authorized to update this application", 403);
        }

        List<String> validStatuses = Arrays.asList("applied", "shortlisted", "interview", "offered", "rejected");
        if (!validStatuses.contains(status)) {
            throw new AppException("Invalid status. Must be one of: " + String.join(", ", validStatuses), 400);
        }

        application.setStatus(status);
        if (notes != null) application.setNotes(notes);

        return applicationRepository.save(application);
    }

    public Application withdrawApplication(String id, String userId) {
        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new AppException("Application not found", 404));

        if (!application.getApplicant().equals(userId)) {
            throw new AppException("Not authorized", 403);
        }

        if (Arrays.asList("offered", "rejected").contains(application.getStatus())) {
            throw new AppException("Cannot withdraw application at this stage", 400);
        }

        application.setStatus("withdrawn");
        return applicationRepository.save(application);
    }

    public List<Map<String, Object>> getApplicantScores(String jobId, String recruiterId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new AppException("Job not found", 404));

        if (!job.getPostedBy().equals(recruiterId)) {
            throw new AppException("Not authorized", 403);
        }

        List<Application> applications = applicationRepository.findByJob(jobId);
        applications.sort((a, b) -> {
            Double scoreA = a.getAssessmentScore() != null ? a.getAssessmentScore() : 0;
            Double scoreB = b.getAssessmentScore() != null ? b.getAssessmentScore() : 0;
            return scoreB.compareTo(scoreA);
        });

        List<Map<String, Object>> result = new ArrayList<>();
        for (Application app : applications) {
            Map<String, Object> appMap = new LinkedHashMap<>();
            appMap.put("_id", app.getId());
            appMap.put("status", app.getStatus());
            appMap.put("assessmentScore", app.getAssessmentScore());
            appMap.put("notes", app.getNotes());

            userRepository.findById(app.getApplicant()).ifPresent(u -> {
                Map<String, Object> applicant = new LinkedHashMap<>();
                applicant.put("_id", u.getId());
                applicant.put("name", u.getName());
                applicant.put("email", u.getEmail());
                applicant.put("skills", u.getSkills());
                appMap.put("applicant", applicant);
            });
            result.add(appMap);
        }
        return result;
    }

    private Map<String, Object> applicationToMap(Application app) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("_id", app.getId());
        map.put("job", app.getJob());
        map.put("applicant", app.getApplicant());
        map.put("status", app.getStatus());
        map.put("coverLetter", app.getCoverLetter());
        map.put("resumeUrl", app.getResumeUrl());
        map.put("notes", app.getNotes());
        map.put("assessmentScore", app.getAssessmentScore());
        map.put("createdAt", app.getCreatedAt());
        map.put("updatedAt", app.getUpdatedAt());
        return map;
    }
}
