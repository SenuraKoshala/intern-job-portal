package com.senura.internship_portal_backend.service.application;

import com.senura.internship_portal_backend.dto.response.ApplicationResponse;
import com.senura.internship_portal_backend.entity.*;
import com.senura.internship_portal_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional
public class JobApplicationServiceImpl implements JobApplicationService {

        private final JobApplicationRepository applicationRepository;
        private final StudentRepository studentRepository;
        private final JobRepository jobRepository;
        private final CompanyRepository companyRepository;

        @Override
        public void applyForJob(String studentEmail, Long jobId, org.springframework.web.multipart.MultipartFile cv,
                        String coverLetter) {

                Student student = studentRepository.findByUser_Email(studentEmail)
                                .orElseThrow(() -> new RuntimeException("Student not found"));

                JobPost job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                if (applicationRepository.existsByStudentIdAndJobPostId(student.getId(), job.getId())) {
                        throw new RuntimeException("Already applied for this job");
                }

                String cvUrl = null;
                if (cv != null && !cv.isEmpty()) {
                        try {
                                String uploadDir = "uploads/";
                                java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
                                if (!java.nio.file.Files.exists(uploadPath)) {
                                        java.nio.file.Files.createDirectories(uploadPath);
                                }
                                String fileName = System.currentTimeMillis() + "_" + cv.getOriginalFilename();
                                java.nio.file.Path filePath = uploadPath.resolve(fileName);
                                java.nio.file.Files.copy(cv.getInputStream(), filePath,
                                                java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                                cvUrl = filePath.toString();
                        } catch (java.io.IOException e) {
                                throw new RuntimeException("Failed to store CV file", e);
                        }
                }

                JobApplication application = JobApplication.builder()
                                .student(student)
                                .jobPost(job)
                                .status(ApplicationStatus.PENDING)
                                .coverLetter(coverLetter)
                                .cvUrl(cvUrl)
                                .appliedAt(LocalDateTime.now())
                                .build();

                applicationRepository.save(application);
        }

        @Override
        public List<ApplicationResponse> getApplicantsForJob(String companyEmail, Long jobId) {

                Company company = companyRepository.findByUserEmail(companyEmail)
                                .orElseThrow(() -> new RuntimeException("Company not found"));

                JobPost job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                if (!job.getCompany().getId().equals(company.getId())) {
                        throw new RuntimeException("Unauthorized access");
                }

                return applicationRepository.findByJobPostId(jobId)
                                .stream()
                                .map(app -> new ApplicationResponse(
                                                app.getId(),
                                                app.getStudent().getFullName(),
                                                app.getJobPost().getTitle(),
                                                app.getStatus(),
                                                app.getCoverLetter(),
                                                app.getCvUrl(),
                                                app.getAppliedAt()))
                                .toList();
        }

        @Override
        public List<ApplicationResponse> getMyApplications(String studentEmail) {

                Student student = studentRepository.findByUser_Email(studentEmail)
                                .orElseThrow(() -> new RuntimeException("Student not found"));

                return applicationRepository.findByStudentId(student.getId())
                                .stream()
                                .map(app -> new ApplicationResponse(
                                                app.getId(),
                                                student.getFullName(),
                                                app.getJobPost().getTitle(),
                                                app.getStatus(),
                                                app.getCoverLetter(),
                                                app.getCvUrl(),
                                                app.getAppliedAt()))
                                .toList();
        }

        @Override
        public void updateApplicationStatus(Long applicationId, String companyEmail, String status) {

                JobApplication application = applicationRepository.findById(applicationId)
                                .orElseThrow(() -> new RuntimeException("Application not found"));

                Company company = companyRepository.findByUserEmail(companyEmail)
                                .orElseThrow(() -> new RuntimeException("Company not found"));

                if (!application.getJobPost().getCompany().getId().equals(company.getId())) {
                        throw new RuntimeException("Unauthorized");
                }

                application.setStatus(ApplicationStatus.valueOf(status));
                applicationRepository.save(application);
        }
}
