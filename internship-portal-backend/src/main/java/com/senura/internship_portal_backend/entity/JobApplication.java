package com.senura.internship_portal_backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_applications", uniqueConstraints = {
                @UniqueConstraint(columnNames = { "student_id", "job_post_id" })
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobApplication {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @ManyToOne
        @JoinColumn(name = "student_id", nullable = false)
        private Student student;

        @ManyToOne
        @JoinColumn(name = "job_post_id", nullable = false)
        private JobPost jobPost;

        @Enumerated(EnumType.STRING)
        private ApplicationStatus status;

        private String coverLetter;
        private String cvUrl;

        private LocalDateTime appliedAt;
}
