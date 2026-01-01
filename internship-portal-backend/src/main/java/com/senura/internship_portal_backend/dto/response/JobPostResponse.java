package com.senura.internship_portal_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class JobPostResponse {
    private Long id;
    private String companyName;
    private String title;
    private String description;
    private String location;
    private String duration;
    private LocalDateTime createdAt;
    private int likes;
    private boolean likedByCurrentUser;
}
