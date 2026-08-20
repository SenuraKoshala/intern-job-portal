import api from "./axios";

// Get all jobs (Public/Student)
export const getAllJobs = (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.keyword) params.append("keyword", filters.keyword);
    if (filters.location) params.append("location", filters.location);
    if (filters.duration) params.append("duration", filters.duration);

    return api.get(`/jobs?${params.toString()}`);
};

// Create a job (Company)
export const createJob = (data) => {
    return api.post("/jobs", data);
};

// Get my jobs (Company)
export const getMyJobs = () => {
    return api.get("/jobs/my");
};

// Like a job (Student)
export const likeJob = (jobId) => {
    return api.post(`/jobs/${jobId}/like`);
};

// Update a job (Company)
export const updateJob = (jobId, jobData) => {
    return api.put(`/jobs/${jobId}`, jobData);
};

// Delete a job (Company)
export const deleteJob = (jobId) => {
    return api.delete(`/jobs/${jobId}`);
};
