package com.senura.internship_portal_backend.config.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(java.util.List.of("http://localhost:5173"));
                    corsConfiguration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(java.util.List.of("*"));
                    return corsConfiguration;
                }))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/jobs/**").permitAll()

                        // Job endpoints
                        .requestMatchers(HttpMethod.POST, "/api/jobs").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.GET, "/api/jobs/my").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.POST, "/api/jobs/*/like").hasRole("STUDENT")

                        .requestMatchers(HttpMethod.POST, "/api/applications/*").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/applications/my").hasRole("STUDENT")

                        .requestMatchers(HttpMethod.GET, "/api/applications/job/**").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.PUT, "/api/applications/**").hasRole("COMPANY")

                        .requestMatchers("/student/**").hasRole("STUDENT")
                        .requestMatchers("/company/**").hasRole("COMPANY")
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
