package com.senura.internship_portal_backend.controller.job;

import com.senura.internship_portal_backend.dto.request.JobPostRequest;
import com.senura.internship_portal_backend.dto.response.JobPostResponse;
import com.senura.internship_portal_backend.service.job.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // COMPANY: Create job
    @PostMapping
    public ResponseEntity<JobPostResponse> createJob(
            @RequestBody JobPostRequest request,
            Authentication authentication) {

        String companyEmail = authentication.getName();
        return ResponseEntity.ok(jobService.createJob(companyEmail, request));
    }

    // PUBLIC: View all jobs (but with like status if logged in)
    @GetMapping
    public ResponseEntity<List<JobPostResponse>> getAllJobs(Authentication authentication) {
        String email = (authentication != null) ? authentication.getName() : null;
        return ResponseEntity.ok(jobService.getAllJobs(email));
    }

    // COMPANY: View own jobs
    @GetMapping("/my")
    public ResponseEntity<List<JobPostResponse>> getMyJobs(Authentication authentication) {
        String companyEmail = authentication.getName();
        return ResponseEntity.ok(jobService.getJobsByCompany(companyEmail));
    }

    // STUDENT: Like job
    @PostMapping("/{jobId}/like")
    public ResponseEntity<String> likeJob(@PathVariable Long jobId, Authentication authentication) {
        jobService.likeJob(jobId, authentication.getName());
        return ResponseEntity.ok("Job liked/unliked successfully"); // Updated message
    }

    // COMPANY: Update job
    @PutMapping("/{jobId}")
    public ResponseEntity<JobPostResponse> updateJob(
            @PathVariable Long jobId,
            @RequestBody JobPostRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(jobService.updateJob(jobId, authentication.getName(), request));
    }

    // COMPANY: Delete job
    @DeleteMapping("/{jobId}")
    public ResponseEntity<String> deleteJob(
            @PathVariable Long jobId,
            Authentication authentication) {
        jobService.deleteJob(jobId, authentication.getName());
        return ResponseEntity.ok("Job deleted successfully");
    }
}
