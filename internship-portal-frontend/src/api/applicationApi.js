import api from "./axios";

// Apply for a job (Student)
// Apply for a job (Student)
export const applyForJob = (jobId, formData) => {
    return api.post(`/applications/${jobId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

// Get my applications (Student)
export const getMyApplications = () => {
    return api.get("/applications/my");
};

// Get applicants for a job (Company)
export const getApplicantsForJob = (jobId) => {
    return api.get(`/applications/job/${jobId}`);
};

// Update application status (Company)
export const updateApplicationStatus = (applicationId, status) => {
    return api.put(`/applications/${applicationId}/status`, { status });
};
