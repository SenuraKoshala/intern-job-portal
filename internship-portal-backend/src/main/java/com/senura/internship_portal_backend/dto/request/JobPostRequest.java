package com.senura.internship_portal_backend.dto.request;

import lombok.Data;

@Data
public class JobPostRequest {
    private String title;
    private String description;
    private String location;
    private String duration;
}

