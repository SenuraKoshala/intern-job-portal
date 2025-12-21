package com.senura.internship_portal_backend.dto.request;

import lombok.Data;

@Data
public class StudentSignupRequest {
    private String email;
    private String password;
    private String fullName;
    private String university;
    private String degree;
    private int academicYear;
}

