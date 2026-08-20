package com.senura.internship_portal_backend.repository;

import com.senura.internship_portal_backend.entity.JobLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobLikeRepository extends JpaRepository<JobLike, Long> {
    boolean existsByStudentIdAndJobPostId(Long studentId, Long jobPostId);

    void deleteByStudentIdAndJobPostId(Long studentId, Long jobPostId);

    int countByJobPostId(Long jobPostId);
}
