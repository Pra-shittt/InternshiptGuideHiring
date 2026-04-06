package com.learn2hire.service;

import com.learn2hire.exception.AppException;
import com.learn2hire.model.Company;
import com.learn2hire.model.User;
import com.learn2hire.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final TestAttemptRepository testAttemptRepository;
    private final CompanyRepository companyRepository;
    private final MongoTemplate mongoTemplate;

    public Map<String, Object> getStats() {
        long totalUsers = userRepository.count();
        long totalCandidates = userRepository.countByRole("candidate");
        long totalRecruiters = userRepository.countByRole("recruiter");
        long totalQuestions = questionRepository.count();
        // Distinct test sessions
        long totalTests = mongoTemplate.getCollection("testattempts")
                .distinct("testSessionId", String.class).into(new ArrayList<>()).size();
        long totalCompanies = companyRepository.count();

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("totalUsers", totalUsers); data.put("totalCandidates", totalCandidates);
        data.put("totalRecruiters", totalRecruiters); data.put("totalQuestions", totalQuestions);
        data.put("totalTests", totalTests); data.put("totalCompanies", totalCompanies);
        return data;
    }

    public List<User> getUsers(String role, String search) {
        Query query = new Query();
        if (role != null && !role.isBlank()) query.addCriteria(Criteria.where("role").is(role));
        if (search != null && !search.isBlank()) {
            query.addCriteria(new Criteria().orOperator(
                    Criteria.where("name").regex(search, "i"),
                    Criteria.where("email").regex(search, "i")));
        }
        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));
        query.fields().exclude("password");
        return mongoTemplate.find(query, User.class);
    }

    public List<Company> getCompanies() {
        return companyRepository.findAllByOrderByCreatedAtDesc();
    }

    public Company createCompany(String name, String description, String industry, String website) {
        if (name == null || name.trim().isEmpty()) throw new AppException("Company name is required", 400);
        if (companyRepository.existsByNameIgnoreCase(name.trim()))
            throw new AppException("Company already exists", 400);
        return companyRepository.save(Company.builder()
                .name(name.trim()).description(description != null ? description : "")
                .industry(industry != null ? industry : "").website(website != null ? website : "").build());
    }

    public Company updateCompany(String id, Map<String, Object> body) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new AppException("Company not found", 404));
        if (body.containsKey("name")) company.setName(((String)body.get("name")).trim());
        if (body.containsKey("description")) company.setDescription((String)body.get("description"));
        if (body.containsKey("industry")) company.setIndustry((String)body.get("industry"));
        if (body.containsKey("website")) company.setWebsite((String)body.get("website"));
        if (body.containsKey("isActive")) company.setIsActive((Boolean)body.get("isActive"));
        return companyRepository.save(company);
    }

    public void deleteCompany(String id) {
        if (!companyRepository.existsById(id)) throw new AppException("Company not found", 404);
        companyRepository.deleteById(id);
    }
}
