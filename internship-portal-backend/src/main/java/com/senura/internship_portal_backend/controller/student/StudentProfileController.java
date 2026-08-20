package com.senura.internship_portal_backend.controller.student;

import com.senura.internship_portal_backend.dto.request.StudentProfileRequest;
import com.senura.internship_portal_backend.dto.response.StudentProfileResponse;
import com.senura.internship_portal_backend.service.student.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/profile")
@RequiredArgsConstructor
public class StudentProfileController {

    private final StudentService studentService;

    @GetMapping
    public ResponseEntity<StudentProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(studentService.getProfile(authentication.getName()));
    }

    @PutMapping
    public ResponseEntity<StudentProfileResponse> updateProfile(
            @RequestBody StudentProfileRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(studentService.updateProfile(authentication.getName(), request));
    }
}
