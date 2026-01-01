package com.senura.internship_portal_backend.repository;

import com.senura.internship_portal_backend.entity.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<JobPost, Long> {

    List<JobPost> findByCompanyId(Long companyId);
}

