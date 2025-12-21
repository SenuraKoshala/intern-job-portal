package com.senura.internship_portal_backend.dto.request;

import lombok.Data;

@Data
public class CompanySignupRequest {
    private String email;
    private String password;
    private String companyName;
    private String description;
    private String website;
    private String location;
}

