package com.learn2hire.service;

import com.learn2hire.exception.AppException;
import com.learn2hire.model.Application;
import com.learn2hire.model.Job;
import com.learn2hire.model.User;
import com.learn2hire.repository.ApplicationRepository;
import com.learn2hire.repository.JobRepository;
import com.learn2hire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    public Job createJob(String userId, Map<String, Object> body) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("User not found", 404));

        Job job = Job.builder()
                .postedBy(userId)
                .title((String) body.get("title"))
                .description((String) body.get("description"))
                .company(body.get("company") != null ? (String) body.get("company") : user.getCompany())
                .location(body.get("location") != null ? (String) body.get("location") : "Remote")
                .type(body.get("type") != null ? (String) body.get("type") : "Full-Time")
                .salary((String) body.get("salary"))
                .openings(body.get("openings") != null ? ((Number) body.get("openings")).intValue() : 1)
                .build();

        if (body.get("skills") != null) {
            @SuppressWarnings("unchecked")
            List<String> skills = (List<String>) body.get("skills");
            job.setSkills(skills);
        }

        return jobRepository.save(job);
    }

    public List<Map<String, Object>> getJobs(Map<String, String> params) {
        Query query = new Query();
        query.addCriteria(Criteria.where("status").is("open"));

        if (params.get("company") != null) {
            query.addCriteria(Criteria.where("company").regex(params.get("company"), "i"));
        }
        if (params.get("type") != null) {
            query.addCriteria(Criteria.where("type").is(params.get("type")));
        }
        if (params.get("skill") != null) {
            query.addCriteria(Criteria.where("skills").in(params.get("skill")));
        }
        if (params.get("search") != null) {
            String search = params.get("search");
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("title").regex(search, "i"),
                    Criteria.where("description").regex(search, "i"),
                    Criteria.where("company").regex(search, "i")
            ));
        }

        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Job> jobs = mongoTemplate.find(query, Job.class);

        // Populate postedBy
        List<Map<String, Object>> result = new ArrayList<>();
        for (Job job : jobs) {
            Map<String, Object> jobMap = jobToMap(job);
            if (job.getPostedBy() != null) {
                userRepository.findById(job.getPostedBy()).ifPresent(u -> {
                    Map<String, Object> postedBy = new LinkedHashMap<>();
                    postedBy.put("_id", u.getId());
                    postedBy.put("name", u.getName());
                    postedBy.put("company", u.getCompany());
                    jobMap.put("postedBy", postedBy);
                });
            }
            result.add(jobMap);
        }
        return result;
    }

    public List<Map<String, Object>> getMyJobs(String userId) {
        List<Job> jobs = jobRepository.findByPostedByOrderByCreatedAtDesc(userId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Job job : jobs) {
            Map<String, Object> jobMap = jobToMap(job);
            long appCount = applicationRepository.countByJob(job.getId());
            jobMap.put("applicationCount", appCount);
            result.add(jobMap);
        }
        return result;
    }

    public Map<String, Object> getJobById(String id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new AppException("Job not found", 404));

        Map<String, Object> jobMap = jobToMap(job);
        if (job.getPostedBy() != null) {
            userRepository.findById(job.getPostedBy()).ifPresent(u -> {
                Map<String, Object> postedBy = new LinkedHashMap<>();
                postedBy.put("_id", u.getId());
                postedBy.put("name", u.getName());
                postedBy.put("company", u.getCompany());
                postedBy.put("email", u.getEmail());
                jobMap.put("postedBy", postedBy);
            });
        }
        return jobMap;
    }

    public Job updateJob(String id, String userId, Map<String, Object> body) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new AppException("Job not found", 404));

        if (!job.getPostedBy().equals(userId)) {
            throw new AppException("Not authorized to update this job", 403);
        }

        if (body.containsKey("title")) job.setTitle((String) body.get("title"));
        if (body.containsKey("description")) job.setDescription((String) body.get("description"));
        if (body.containsKey("company")) job.setCompany((String) body.get("company"));
        if (body.containsKey("location")) job.setLocation((String) body.get("location"));
        if (body.containsKey("type")) job.setType((String) body.get("type"));
        if (body.containsKey("salary")) job.setSalary((String) body.get("salary"));
        if (body.containsKey("status")) job.setStatus((String) body.get("status"));
        if (body.containsKey("openings")) job.setOpenings(((Number) body.get("openings")).intValue());
        if (body.containsKey("skills")) {
            @SuppressWarnings("unchecked")
            List<String> skills = (List<String>) body.get("skills");
            job.setSkills(skills);
        }

        return jobRepository.save(job);
    }

    public void deleteJob(String id, String userId) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new AppException("Job not found", 404));

        if (!job.getPostedBy().equals(userId)) {
            throw new AppException("Not authorized to delete this job", 403);
        }

        applicationRepository.deleteByJob(id);
        jobRepository.deleteById(id);
    }

    private Map<String, Object> jobToMap(Job job) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("_id", job.getId());
        map.put("postedBy", job.getPostedBy());
        map.put("title", job.getTitle());
        map.put("description", job.getDescription());
        map.put("company", job.getCompany());
        map.put("location", job.getLocation());
        map.put("type", job.getType());
        map.put("skills", job.getSkills());
        map.put("salary", job.getSalary());
        map.put("openings", job.getOpenings());
        map.put("status", job.getStatus());
        map.put("deadline", job.getDeadline());
        map.put("createdAt", job.getCreatedAt());
        map.put("updatedAt", job.getUpdatedAt());
        return map;
    }
}
