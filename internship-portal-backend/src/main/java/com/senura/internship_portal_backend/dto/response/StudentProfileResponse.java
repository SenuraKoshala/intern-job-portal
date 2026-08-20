package com.senura.internship_portal_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentProfileResponse {
    private String fullName;
    private String email;
    private String university;
    private String degree;
    private int academicYear;
    private String cvUrl;
    private String bio;
    private String skills;
    private String experience;
    private String portfolioUrl;
    private String linkedInUrl;
}
