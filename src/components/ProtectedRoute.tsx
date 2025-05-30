
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

  // Pour la page admin, pas de vérification d'authentification nécessaire
  if (location.pathname === '/admin') {
    console.log('✅ [PROTECTED_ROUTE] Page admin, accès direct autorisé');
    return <>{children}</>;
  }

  // Afficher un loading pendant la vérification pour les autres pages
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
  
  // Pour les autres pages, vérifier l'approbation si requise
  if (requireApproval && user && !user.isApproved) {
    console.log('⚠️ [PROTECTED_ROUTE] Utilisateur non approuvé, redirection vers login');
    return <Navigate to="/login" replace />;
  }

  // Afficher le contenu protégé
  console.log('✅ [PROTECTED_ROUTE] Utilisateur authentifié, affichage du contenu');
  return <>{children}</>;
};
