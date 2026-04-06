package com.learn2hire.service;

import com.learn2hire.exception.AppException;
import com.learn2hire.model.Interview;
import com.learn2hire.model.User;
import com.learn2hire.repository.InterviewRepository;
import com.learn2hire.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final UserRepository userRepository;

    public Map<String, Object> startInterview(String interviewId) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new AppException("Interview not found", 404));

        String meetingRoomId = "room_" + UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        interview.setMeetingRoomId(meetingRoomId);
        interview.setStatus("IN_PROGRESS");
        interviewRepository.save(interview);

        // Update candidate status
        userRepository.findById(interview.getCandidateId()).ifPresent(u -> {
            u.setInterviewStatus("in-interview");
            userRepository.save(u);
        });

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("interviewId", interview.getId());
        data.put("meetingRoomId", meetingRoomId);
        data.put("candidateId", interview.getCandidateId());
        data.put("recruiterId", interview.getRecruiterId());
        return data;
    }

    public Interview saveNotes(String interviewId, String notes, Integer rating) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new AppException("Interview not found", 404));

        if (notes != null) interview.setNotes(notes);
        if (rating != null) interview.setRating(rating);

        return interviewRepository.save(interview);
    }

    public Interview endInterview(String interviewId, String result, String notes, Integer rating) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new AppException("Interview not found", 404));

        interview.setStatus("COMPLETED");
        if (result != null) interview.setResult(result);
        if (notes != null) interview.setNotes(notes);
        if (rating != null) interview.setRating(rating);
        interviewRepository.save(interview);

        // Update candidate status
        String newStatus = "selected".equals(result) ? "hired" :
                          "rejected".equals(result) ? "rejected" : "available";
        userRepository.findById(interview.getCandidateId()).ifPresent(u -> {
            u.setInterviewStatus(newStatus);
            userRepository.save(u);
        });

        return interview;
    }

    public Map<String, Object> getInterviewById(String id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new AppException("Interview not found", 404));

        Map<String, Object> data = interviewToMap(interview);

        // Populate candidate
        userRepository.findById(interview.getCandidateId()).ifPresent(u -> {
            Map<String, Object> candidate = new LinkedHashMap<>();
            candidate.put("_id", u.getId());
            candidate.put("name", u.getName());
            candidate.put("email", u.getEmail());
            candidate.put("skills", u.getSkills());
            candidate.put("resumeUrl", u.getResumeUrl());
            data.put("candidateId", candidate);
        });

        // Populate recruiter
        userRepository.findById(interview.getRecruiterId()).ifPresent(u -> {
            Map<String, Object> recruiter = new LinkedHashMap<>();
            recruiter.put("_id", u.getId());
            recruiter.put("name", u.getName());
            recruiter.put("email", u.getEmail());
            recruiter.put("company", u.getCompany());
            data.put("recruiterId", recruiter);
        });

        return data;
    }

    public List<Map<String, Object>> getCandidateInterviews(String userId) {
        List<Interview> interviews = interviewRepository
                .findByCandidateIdAndStatusInOrderByScheduledAtAsc(
                        userId, Arrays.asList("SCHEDULED", "IN_PROGRESS"));

        List<Map<String, Object>> result = new ArrayList<>();
        for (Interview interview : interviews) {
            Map<String, Object> data = interviewToMap(interview);

            userRepository.findById(interview.getRecruiterId()).ifPresent(u -> {
                Map<String, Object> recruiter = new LinkedHashMap<>();
                recruiter.put("_id", u.getId());
                recruiter.put("name", u.getName());
                recruiter.put("email", u.getEmail());
                recruiter.put("company", u.getCompany());
                data.put("recruiterId", recruiter);
            });
            result.add(data);
        }
        return result;
    }

    private Map<String, Object> interviewToMap(Interview interview) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("_id", interview.getId());
        map.put("candidateId", interview.getCandidateId());
        map.put("recruiterId", interview.getRecruiterId());
        map.put("scheduledAt", interview.getScheduledAt());
        map.put("meetingRoomId", interview.getMeetingRoomId());
        map.put("notes", interview.getNotes());
        map.put("rating", interview.getRating());
        map.put("result", interview.getResult());
        map.put("status", interview.getStatus());
        map.put("createdAt", interview.getCreatedAt());
        map.put("updatedAt", interview.getUpdatedAt());
        return map;
    }
}
