package com.senura.internship_portal_backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_posts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPost {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    private String location;

    private String duration;

    private LocalDateTime createdAt;

    private int likes;

    @OneToMany(mappedBy = "jobPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<JobApplication> applications;

    @OneToMany(mappedBy = "jobPost", cascade = CascadeType.ALL, orphanRemoval = true)
    private java.util.List<JobLike> jobLikes;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
