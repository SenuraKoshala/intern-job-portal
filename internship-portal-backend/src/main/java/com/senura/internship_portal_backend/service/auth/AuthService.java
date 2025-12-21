package com.senura.internship_portal_backend.service.auth;

import com.senura.internship_portal_backend.dto.request.CompanySignupRequest;
import com.senura.internship_portal_backend.dto.request.LoginRequest;
import com.senura.internship_portal_backend.dto.request.StudentSignupRequest;
import com.senura.internship_portal_backend.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse registerStudent(StudentSignupRequest request);

    AuthResponse registerCompany(CompanySignupRequest request);

    AuthResponse login(LoginRequest request);
}

