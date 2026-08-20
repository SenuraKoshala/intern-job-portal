package com.senura.internship_portal_backend.service.student;

import com.senura.internship_portal_backend.dto.request.StudentProfileRequest;
import com.senura.internship_portal_backend.dto.response.StudentProfileResponse;

public interface StudentService {
    StudentProfileResponse getProfile(String email);

    StudentProfileResponse updateProfile(String email, StudentProfileRequest request);
}
