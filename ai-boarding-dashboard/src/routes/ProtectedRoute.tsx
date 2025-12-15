import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ROUTES } from '@/utils/constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, loading, isAuthenticated } = useAuth();
  
    console.log('🛡️ ProtectedRoute:', { loading, isAuthenticated, user });
  
    if (loading) {
      console.log('⏳ Mostrando LoadingSpinner');
      return <LoadingSpinner />;
    }
  
    if (!isAuthenticated) {
      console.log('❌ No autenticado, redirigiendo a login');
      return <Navigate to={ROUTES.LOGIN} replace />;
    }
  
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      console.log('🚫 Usuario sin permisos, redirigiendo a dashboard');
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  
    console.log('✅ Renderizando children');
    return <>{children}</>;
  };