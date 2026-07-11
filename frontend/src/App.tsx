import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './features/auth/pages/LoginPage';
import ProfilePage from './features/auth/pages/ProfilePage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import CertificatesPage from './features/certificates/pages/CertificatesPage';
import CertificateDashboardPage from './features/certificates/pages/CertificateDashboardPage';
import CertificateDetailPage from './features/certificates/pages/CertificateDetailPage';
import VehiclesPage from './features/vehicles/pages/VehiclesPage';
import FleetDashboardPage, { AssignmentsPage } from './features/vehicles/pages/FleetDashboardPage';
import MaintenancePage from './features/vehicles/pages/MaintenancePage';
import NotificationsPage from './features/notifications/pages/NotificationsPage';
import ProjectsPage from './features/projects/pages/ProjectsPage';
import ProjectDetailPage from './features/projects/pages/ProjectDetailPage';
import ProjectDashboardPage from './features/projects/pages/ProjectDashboardPage';
import ResourceAllocationPage from './features/projects/pages/ResourceAllocationPage';
import ExecutiveDashboardPage from './features/executive/pages/ExecutiveDashboardPage';
import ReportsPage from './features/reports/pages/ReportsPage';

function AppLoader() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        bgcolor: '#f0f4f8',
      }}
    >
      <CircularProgress size={40} sx={{ color: 'primary.main' }} />
    </Box>
  );
}

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <AppLoader />;

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/executive" element={<ExecutiveDashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/dashboard" element={<ProjectDashboardPage />} />
        <Route path="/projects/allocations" element={<ResourceAllocationPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/certificates/dashboard" element={<CertificateDashboardPage />} />
        <Route path="/certificates/:id" element={<CertificateDetailPage />} />
        <Route path="/vehicles" element={<VehiclesPage />} />
        <Route path="/vehicles/dashboard" element={<FleetDashboardPage />} />
        <Route path="/vehicles/assignments" element={<AssignmentsPage />} />
        <Route path="/vehicles/maintenance" element={<MaintenancePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
