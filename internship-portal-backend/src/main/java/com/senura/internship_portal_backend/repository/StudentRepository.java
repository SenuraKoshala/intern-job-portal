package com.senura.internship_portal_backend.repository;

import com.senura.internship_portal_backend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}

