package com.senura.internship_portal_backend.repository;

import com.senura.internship_portal_backend.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}

