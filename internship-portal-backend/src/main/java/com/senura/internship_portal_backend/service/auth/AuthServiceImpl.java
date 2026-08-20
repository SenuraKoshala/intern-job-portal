package com.senura.internship_portal_backend.service.auth;

import com.senura.internship_portal_backend.config.security.JwtUtils;
import com.senura.internship_portal_backend.dto.request.CompanySignupRequest;
import com.senura.internship_portal_backend.dto.request.LoginRequest;
import com.senura.internship_portal_backend.dto.request.StudentSignupRequest;
import com.senura.internship_portal_backend.dto.response.AuthResponse;
import com.senura.internship_portal_backend.entity.*;
import com.senura.internship_portal_backend.repository.CompanyRepository;
import com.senura.internship_portal_backend.repository.StudentRepository;
import com.senura.internship_portal_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Override
    public AuthResponse registerStudent(StudentSignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new com.senura.internship_portal_backend.exception.UserAlreadyExistsException(
                    "Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_STUDENT)
                .enabled(true)
                .build();

        userRepository.save(user);

        Student student = Student.builder()
                .user(user)
                .fullName(request.getFullName())
                .university(request.getUniversity())
                .degree(request.getDegree())
                .academicYear(request.getAcademicYear())
                .build();

        studentRepository.save(student);

        // Generate JWT token
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse("Student registered successfully", user.getRole().name(), token);
    }

    @Override
    public AuthResponse registerCompany(CompanySignupRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new com.senura.internship_portal_backend.exception.UserAlreadyExistsException(
                    "Email already registered");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_COMPANY)
                .enabled(true)
                .build();

        userRepository.save(user);

        Company company = Company.builder()
                .user(user)
                .companyName(request.getCompanyName())
                .description(request.getDescription())
                .website(request.getWebsite())
                .location(request.getLocation())
                .build();

        companyRepository.save(company);

        // Generate JWT token
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse("Company registered successfully", user.getRole().name(), token);
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtils.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse("Login successful", user.getRole().name(), token);
    }

}
