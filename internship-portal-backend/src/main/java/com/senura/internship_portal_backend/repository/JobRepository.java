package com.senura.internship_portal_backend.repository;

import com.senura.internship_portal_backend.entity.JobPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRepository extends JpaRepository<JobPost, Long> {

    List<JobPost> findByCompanyId(Long companyId);

    @org.springframework.data.jpa.repository.Query("SELECT j FROM JobPost j WHERE " +
            "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.company.companyName) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND "
            +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) AND " +
            "(:duration IS NULL OR LOWER(j.duration) LIKE LOWER(CONCAT('%', :duration, '%')))")
    List<JobPost> searchJobs(
            @org.springframework.data.repository.query.Param("keyword") String keyword,
            @org.springframework.data.repository.query.Param("location") String location,
            @org.springframework.data.repository.query.Param("duration") String duration);
}
