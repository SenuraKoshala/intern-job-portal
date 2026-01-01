package com.senura.internship_portal_backend.repository;

import com.senura.internship_portal_backend.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyRepository extends JpaRepository<Company, Long> {

    Optional<Company> findByUserEmail(String email);
}


