package com.senura.internship_portal_backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "students")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private String fullName;

    private String university;

    private String degree;

    private int academicYear;

    private String cvUrl;

    @Column(length = 2000)
    private String bio;

    private String skills; // Comma separated

    @Column(length = 2000)
    private String experience;

    private String portfolioUrl;

    private String linkedInUrl;
}
