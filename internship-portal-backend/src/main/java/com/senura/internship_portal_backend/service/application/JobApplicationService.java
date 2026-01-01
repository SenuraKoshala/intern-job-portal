package com.senura.internship_portal_backend.service.application;

import com.senura.internship_portal_backend.dto.response.ApplicationResponse;

import java.util.List;

public interface JobApplicationService {

    void applyForJob(String studentEmail, Long jobId, org.springframework.web.multipart.MultipartFile cv,
            String coverLetter);

    List<ApplicationResponse> getApplicantsForJob(String companyEmail, Long jobId);

    List<ApplicationResponse> getMyApplications(String studentEmail);

    void updateApplicationStatus(Long applicationId, String companyEmail, String status);
}
