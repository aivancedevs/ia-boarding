import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Users } from '@/pages/Users';
import { Clients } from '@/pages/Clients';
import { Projects } from '@/pages/Projects';
import { Profile } from '@/pages/Profile';
import { ROUTES, USER_ROLES } from '@/utils/constants';

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={ROUTES.LOGIN}
        element={isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : <Login />}
      />

      {/* Protected Routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        
        <Route
          path="users"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <Users />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="clients"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.CLIENT_ADMIN]}>
              <Clients />
            </ProtectedRoute>
          }
        />
        
        <Route path="projects" element={<Projects />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Redirect root to dashboard or login */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={ROUTES.DASHBOARD} replace />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />

      {/* 404 - Not Found */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            <Navigate to={ROUTES.DASHBOARD} replace />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;