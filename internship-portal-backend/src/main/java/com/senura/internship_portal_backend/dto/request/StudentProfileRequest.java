package com.senura.internship_portal_backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentProfileRequest {
    private String fullName;
    private String university;
    private String degree;
    private int academicYear;
    private String bio;
    private String skills;
    private String experience;
    private String portfolioUrl;
    private String linkedInUrl;
}
