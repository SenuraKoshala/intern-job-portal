package com.senura.internship_portal_backend.service.student;

import com.senura.internship_portal_backend.dto.request.StudentProfileRequest;
import com.senura.internship_portal_backend.dto.response.StudentProfileResponse;
import com.senura.internship_portal_backend.entity.Student;
import com.senura.internship_portal_backend.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;

    @Override
    public StudentProfileResponse getProfile(String email) {
        Student student = studentRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        return mapToResponse(student);
    }

    @Override
    public StudentProfileResponse updateProfile(String email, StudentProfileRequest request) {
        Student student = studentRepository.findByUser_Email(email)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        if (request.getFullName() != null)
            student.setFullName(request.getFullName());
        if (request.getUniversity() != null)
            student.setUniversity(request.getUniversity());
        if (request.getDegree() != null)
            student.setDegree(request.getDegree());
        if (request.getAcademicYear() > 0)
            student.setAcademicYear(request.getAcademicYear());
        if (request.getBio() != null)
            student.setBio(request.getBio());
        if (request.getSkills() != null)
            student.setSkills(request.getSkills());
        if (request.getExperience() != null)
            student.setExperience(request.getExperience());
        if (request.getPortfolioUrl() != null)
            student.setPortfolioUrl(request.getPortfolioUrl());
        if (request.getLinkedInUrl() != null)
            student.setLinkedInUrl(request.getLinkedInUrl());

        studentRepository.save(student);
        return mapToResponse(student);
    }

    private StudentProfileResponse mapToResponse(Student student) {
        return StudentProfileResponse.builder()
                .fullName(student.getFullName())
                .email(student.getUser().getEmail())
                .university(student.getUniversity())
                .degree(student.getDegree())
                .academicYear(student.getAcademicYear())
                .cvUrl(student.getCvUrl())
                .bio(student.getBio())
                .skills(student.getSkills())
                .experience(student.getExperience())
                .portfolioUrl(student.getPortfolioUrl())
                .linkedInUrl(student.getLinkedInUrl())
                .build();
    }
}
