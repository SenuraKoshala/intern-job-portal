package com.senura.internship_portal_backend.controller.auth;

import com.senura.internship_portal_backend.dto.request.CompanySignupRequest;
import com.senura.internship_portal_backend.dto.request.LoginRequest;
import com.senura.internship_portal_backend.dto.request.StudentSignupRequest;
import com.senura.internship_portal_backend.dto.response.AuthResponse;
import com.senura.internship_portal_backend.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup/student")
    public ResponseEntity<AuthResponse> registerStudent(
            @RequestBody StudentSignupRequest request) {
        return ResponseEntity.ok(authService.registerStudent(request));
    }

    @PostMapping("/signup/company")
    public ResponseEntity<AuthResponse> registerCompany(
            @RequestBody CompanySignupRequest request) {
        return ResponseEntity.ok(authService.registerCompany(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}

