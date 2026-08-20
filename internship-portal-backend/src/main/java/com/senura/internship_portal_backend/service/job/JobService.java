package com.senura.internship_portal_backend.service.job;

import com.senura.internship_portal_backend.dto.request.JobPostRequest;
import com.senura.internship_portal_backend.dto.response.JobPostResponse;

import java.util.List;

public interface JobService {

    JobPostResponse createJob(String companyEmail, JobPostRequest request);

    List<JobPostResponse> getAllJobs(String keyword, String location, String duration, String currentUserEmail);

    List<JobPostResponse> getJobsByCompany(String companyEmail);

    void likeJob(Long jobId, String studentEmail);

    JobPostResponse updateJob(Long jobId, String companyEmail, JobPostRequest request);

    void deleteJob(Long jobId, String companyEmail);
}
