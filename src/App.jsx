import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import { StudentDataProvider } from './context/StudentDataContext';

// Layouts & Public Pages
import DashboardLayout from './components/common/DashboardLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RoleSelectPage from './pages/auth/RoleSelectPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentDirectory from './pages/admin/StudentDirectory';
import FacultyRoster from './pages/admin/FacultyRoster';
import DepartmentAnalytics from './pages/admin/DepartmentAnalytics';
import RiskEngineSimulator from './pages/admin/RiskEngineSimulator';
import InstitutionAnalytics from './pages/admin/InstitutionAnalytics';
import AcademicReports from './pages/admin/AcademicReports';
import SystemAuditLogs from './pages/admin/SystemAuditLogs';
import SystemSettings from './pages/admin/SystemSettings';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import MyStudents from './pages/faculty/MyStudents';
import StudentDataCollection from './pages/faculty/StudentDataCollection';
import AcademicPerformance from './pages/faculty/AcademicPerformance';
import FacultyPredictions from './pages/faculty/FacultyPredictions';
import InterventionsTracking from './pages/faculty/InterventionsTracking';
import CohortReports from './pages/faculty/CohortReports';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentPerformance from './pages/student/StudentPerformance';
import StudentRiskAnalysis from './pages/student/StudentRiskAnalysis';
import StudentRecommendations from './pages/student/StudentRecommendations';
import StudentInterventions from './pages/student/StudentInterventions';
import StudentProfile from './pages/student/StudentProfile';

export default function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <StudentDataProvider>
            <Router>
              <Routes>
                {/* Public & Authentication Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/roles" element={<RoleSelectPage />} />

                {/* Admin Portal Routes (Guarded for Admin role) */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="students" element={<StudentDirectory />} />
                    <Route path="faculty" element={<FacultyRoster />} />
                    <Route path="departments" element={<DepartmentAnalytics />} />
                    <Route path="predictions" element={<RiskEngineSimulator />} />
                    <Route path="analytics" element={<InstitutionAnalytics />} />
                    <Route path="reports" element={<AcademicReports />} />
                    <Route path="logs" element={<SystemAuditLogs />} />
                    <Route path="settings" element={<SystemSettings />} />
                  </Route>
                </Route>

                {/* Faculty Portal Routes (Guarded for Faculty role) */}
                <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
                  <Route path="/faculty" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/faculty/dashboard" replace />} />
                    <Route path="dashboard" element={<FacultyDashboard />} />
                    <Route path="students" element={<MyStudents />} />
                    <Route path="data-collection" element={<StudentDataCollection />} />
                    <Route path="data-entry" element={<StudentDataCollection />} />
                    <Route path="performance" element={<AcademicPerformance />} />
                    <Route path="predictions" element={<FacultyPredictions />} />
                    <Route path="interventions" element={<InterventionsTracking />} />
                    <Route path="reports" element={<CohortReports />} />
                  </Route>
                </Route>

                {/* Student Portal Routes (Guarded for Student role) */}
                <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                  <Route path="/student" element={<DashboardLayout />}>
                    <Route index element={<Navigate to="/student/dashboard" replace />} />
                    <Route path="dashboard" element={<StudentDashboard />} />
                    <Route path="performance" element={<StudentPerformance />} />
                    <Route path="risk" element={<StudentRiskAnalysis />} />
                    <Route path="risk-analysis" element={<StudentRiskAnalysis />} />
                    <Route path="recommendations" element={<StudentRecommendations />} />
                    <Route path="interventions" element={<StudentInterventions />} />
                    <Route path="profile" element={<StudentProfile />} />
                  </Route>
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </StudentDataProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}
