package com.senura.internship_portal_backend.dto.response;

import com.senura.internship_portal_backend.entity.ApplicationStatus;
import java.time.LocalDateTime;

public record ApplicationResponse(
                Long applicationId,
                String studentName,
                String jobTitle,
                ApplicationStatus status,
                String coverLetter,
                String cvUrl,
                LocalDateTime appliedAt) {
}
