package com.senura.internship_portal_backend.dto.request;

import com.senura.internship_portal_backend.entity.ApplicationStatus;

public record UpdateApplicationStatusRequest(
        ApplicationStatus status
) {}
