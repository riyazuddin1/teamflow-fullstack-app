import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailsPage from "./pages/ProjectDetailsPage";
import TasksPage from "./pages/TasksPage";
import TeamPage from "./pages/TeamPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AppLayout from "./components/layout/AppLayout";

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="grid min-h-screen place-items-center">Loading workspace...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="team" element={<ProtectedRoute roles={["admin"]}><TeamPage /></ProtectedRoute>} />
          <Route path="analytics" element={<ProtectedRoute roles={["admin"]}><AnalyticsPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster richColors theme="dark" closeButton />
    </>
  );
}
