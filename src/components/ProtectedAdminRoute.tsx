
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseSession } from '@/hooks/useSupabaseSession';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  const { user, loading } = useSupabaseSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, redirigir al login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Si el usuario no es admin, redirigir al inicio
  if (user.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedAdminRoute;
