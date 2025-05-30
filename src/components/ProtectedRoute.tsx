
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requireApproval?: boolean;
}

export const ProtectedRoute = ({ children, requireApproval = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  console.log('🛡️ [PROTECTED_ROUTE] État:', { 
    isAuthenticated, 
    isLoading, 
    userId: user?.id,
    isApproved: user?.isApproved,
    requireApproval,
    currentPath: location.pathname
  });

  // Afficher un loading pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-white text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-bright-turquoise to-electric-blue animate-pulse-ai mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2 font-sharp">Vérification...</h3>
          <p className="text-muted-foreground">
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  // Rediriger vers la page de connexion si non authentifié
  if (!isAuthenticated) {
    console.log('❌ [PROTECTED_ROUTE] Non authentifié, redirection vers /login');
    return <Navigate to="/login" replace />;
  }

  // La page admin ne nécessite pas d'approbation
  const isAdminPage = location.pathname === '/admin';
  
  // Vérifier l'approbation si requise ET si ce n'est pas la page admin
  if (requireApproval && !isAdminPage && user && !user.isApproved) {
    console.log('⚠️ [PROTECTED_ROUTE] Utilisateur non approuvé, redirection vers login');
    return <Navigate to="/login" replace />;
  }

  // Afficher le contenu protégé
  console.log('✅ [PROTECTED_ROUTE] Utilisateur authentifié, affichage du contenu');
  return <>{children}</>;
};
