package com.senura.internship_portal_backend.controller.application;

import com.senura.internship_portal_backend.dto.request.UpdateApplicationStatusRequest;
import com.senura.internship_portal_backend.dto.response.ApplicationResponse;
import com.senura.internship_portal_backend.service.application.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService applicationService;

    @PostMapping("/{jobId}")
    public ResponseEntity<String> applyForJob(
            @PathVariable Long jobId,
            @RequestParam(value = "cv", required = false) org.springframework.web.multipart.MultipartFile cv,
            @RequestParam(value = "coverLetter", required = false) String coverLetter,
            Authentication authentication) {

        try {
            applicationService.applyForJob(authentication.getName(), jobId, cv, coverLetter);
            return ResponseEntity.ok("Application submitted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // STUDENT: View own applications
    @GetMapping("/my")
    public ResponseEntity<List<ApplicationResponse>> getMyApplications(
            Authentication authentication) {

        return ResponseEntity.ok(
                applicationService.getMyApplications(authentication.getName()));
    }

    // COMPANY: View applicants for a job
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicants(
            @PathVariable Long jobId,
            Authentication authentication) {

        return ResponseEntity.ok(
                applicationService.getApplicantsForJob(authentication.getName(), jobId));
    }

    // COMPANY: Accept / Reject
    @PutMapping("/{applicationId}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long applicationId,
            @RequestBody UpdateApplicationStatusRequest request,
            Authentication authentication) {

        applicationService.updateApplicationStatus(
                applicationId,
                authentication.getName(),
                request.status().name());
        return ResponseEntity.ok("Application status updated");
    }
}
