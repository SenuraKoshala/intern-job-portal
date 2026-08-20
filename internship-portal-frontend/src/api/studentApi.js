import api from "./axios";

// Get student profile
export const getProfile = () => {
    return api.get("/student/profile");
};

// Update student profile
export const updateProfile = (profileData) => {
    return api.put("/student/profile", profileData);
};
