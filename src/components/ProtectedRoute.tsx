
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('🛡️ [PROTECTED_ROUTE] État:', { isAuthenticated, isLoading });

  // Afficher un loading pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p>Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    console.log('❌ [PROTECTED_ROUTE] Non authentifié, redirection vers /login');
    return <Navigate to="/login" replace />;
  }

  // Afficher le contenu protégé
  console.log('✅ [PROTECTED_ROUTE] Utilisateur authentifié, affichage du contenu');
  return <>{children}</>;
};
