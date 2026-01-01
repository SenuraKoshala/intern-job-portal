package com.senura.internship_portal_backend.repository;

import com.senura.internship_portal_backend.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    boolean existsByStudentIdAndJobPostId(Long studentId, Long jobPostId);

    List<JobApplication> findByJobPostId(Long jobPostId);

    List<JobApplication> findByStudentId(Long studentId);
}

