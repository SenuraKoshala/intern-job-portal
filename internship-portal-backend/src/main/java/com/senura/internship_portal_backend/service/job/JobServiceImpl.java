package com.senura.internship_portal_backend.service.job;

import com.senura.internship_portal_backend.dto.request.JobPostRequest;
import com.senura.internship_portal_backend.dto.response.JobPostResponse;
import com.senura.internship_portal_backend.entity.Company;
import com.senura.internship_portal_backend.entity.JobPost;
import com.senura.internship_portal_backend.repository.CompanyRepository;
import com.senura.internship_portal_backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@org.springframework.transaction.annotation.Transactional
public class JobServiceImpl implements JobService {

        private final JobRepository jobRepository;
        private final CompanyRepository companyRepository;
        private final com.senura.internship_portal_backend.repository.JobLikeRepository jobLikeRepository;
        private final com.senura.internship_portal_backend.repository.StudentRepository studentRepository;

        @Override
        public JobPostResponse createJob(String companyEmail, JobPostRequest request) {

                Company company = companyRepository.findByUserEmail(companyEmail)
                                .orElseThrow(() -> new RuntimeException("Company not found"));

                JobPost jobPost = JobPost.builder()
                                .company(company)
                                .title(request.getTitle())
                                .description(request.getDescription())
                                .location(request.getLocation())
                                .duration(request.getDuration())
                                .likes(0)
                                .build();

                jobRepository.save(jobPost);

                return mapToResponse(jobPost, null);
        }

        @Override
        public List<JobPostResponse> getAllJobs(String currentUserEmail) {
                return jobRepository.findAll()
                                .stream()
                                .map(job -> mapToResponse(job, currentUserEmail))
                                .collect(Collectors.toList());
        }

        @Override
        public List<JobPostResponse> getJobsByCompany(String companyEmail) {

                Company company = companyRepository.findByUserEmail(companyEmail)
                                .orElseThrow(() -> new RuntimeException("Company not found"));

                return jobRepository.findByCompanyId(company.getId())
                                .stream()
                                .map(job -> mapToResponse(job, null)) // Company doesn't need to know if they liked it
                                                                      // (conceptually)
                                .collect(Collectors.toList());
        }

        @Override
        public void likeJob(Long jobId, String studentEmail) {
                JobPost jobPost = jobRepository.findById(jobId)
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                com.senura.internship_portal_backend.entity.Student student = studentRepository
                                .findByUser_Email(studentEmail)
                                .orElseThrow(() -> new RuntimeException("Student not found"));

                if (jobLikeRepository.existsByStudentIdAndJobPostId(student.getId(), jobId)) {
                        // Unlike
                        jobLikeRepository.deleteByStudentIdAndJobPostId(student.getId(), jobId);
                        jobPost.setLikes(Math.max(0, jobPost.getLikes() - 1));
                } else {
                        // Like
                        com.senura.internship_portal_backend.entity.JobLike like = com.senura.internship_portal_backend.entity.JobLike
                                        .builder()
                                        .student(student)
                                        .jobPost(jobPost)
                                        .createdAt(java.time.LocalDateTime.now())
                                        .build();
                        jobLikeRepository.save(like);
                        jobPost.setLikes(jobPost.getLikes() + 1);
                }

                jobRepository.save(jobPost);
        }

        @Override
        public JobPostResponse updateJob(Long jobId, String companyEmail, JobPostRequest request) {
                JobPost job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                Company company = companyRepository.findByUserEmail(companyEmail)
                                .orElseThrow(() -> new RuntimeException("Company not found"));

                if (!job.getCompany().getId().equals(company.getId())) {
                        throw new RuntimeException("Unauthorized to update this job");
                }

                job.setTitle(request.getTitle());
                job.setDescription(request.getDescription());
                job.setLocation(request.getLocation());
                job.setDuration(request.getDuration());

                jobRepository.save(job);
                return mapToResponse(job, null);
        }

        @Override
        public void deleteJob(Long jobId, String companyEmail) {
                JobPost job = jobRepository.findById(jobId)
                                .orElseThrow(() -> new RuntimeException("Job not found"));

                Company company = companyRepository.findByUserEmail(companyEmail)
                                .orElseThrow(() -> new RuntimeException("Company not found"));

                if (!job.getCompany().getId().equals(company.getId())) {
                        throw new RuntimeException("Unauthorized to delete this job");
                }

                jobRepository.delete(job);
        }

        private JobPostResponse mapToResponse(JobPost job, String currentUserEmail) {
                boolean isLiked = false;
                if (currentUserEmail != null) {
                        // Check if user is a student and has liked this job
                        // Efficiency Note: In a real app, we'd batch fetch likes. For now, N+1 is
                        // acceptable given the scope.
                        try {
                                com.senura.internship_portal_backend.entity.Student student = studentRepository
                                                .findByUser_Email(currentUserEmail).orElse(null);
                                if (student != null) {
                                        isLiked = jobLikeRepository.existsByStudentIdAndJobPostId(student.getId(),
                                                        job.getId());
                                }
                        } catch (Exception e) {
                                // ignore
                        }
                }

                return new JobPostResponse(
                                job.getId(),
                                job.getCompany().getCompanyName(),
                                job.getTitle(),
                                job.getDescription(),
                                job.getLocation(),
                                job.getDuration(),
                                job.getCreatedAt(),
                                job.getLikes(),
                                isLiked);
        }
}
