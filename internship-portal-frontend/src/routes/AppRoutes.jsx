import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../auth/Login";
import RegisterStudent from "../auth/RegisterStudent";
import RegisterCompany from "../auth/RegisterCompany";
import ProtectedRoute from "../auth/ProtectedRoute";

import StudentDashboard from "../pages/student/StudentDashboard";
import StudentProfile from "../pages/student/StudentProfile";
import CompanyDashboard from "../pages/company/CompanyDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register/student" element={<RegisterStudent />} />
      <Route path="/register/company" element={<RegisterCompany />} />

      {/* Protected Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute role="ROLE_STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute role="ROLE_STUDENT">
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute role="ROLE_COMPANY">
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
