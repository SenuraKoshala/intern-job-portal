import api from "./axios";

// Student Signup
export const studentSignup = (data) => {
  return api.post("/auth/signup/student", data);
};

// Company Signup
export const companySignup = (data) => {
  return api.post("/auth/signup/company", data);
};

// Login (Student / Company)
export const login = (data) => {
  return api.post("/auth/login", data);
};
