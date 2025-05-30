
import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  requireApproval?: boolean;
}

export const ProtectedRoute = ({ children, requireApproval = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('🛡️ [PROTECTED_ROUTE] État:', { 
    isAuthenticated, 
    isLoading, 
    userId: user?.id,
    isApproved: user?.isApproved,
    requireApproval 
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

  // Vérifier l'approbation si requise
  if (requireApproval && user && !user.isApproved) {
    console.log('⚠️ [PROTECTED_ROUTE] Utilisateur non approuvé');
    return (
      <div className="min-h-screen flex items-center justify-center gradient-bg">
        <div className="text-white text-center max-w-md bg-card/50 backdrop-blur-lg border-bright-turquoise/20 rounded-lg p-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-red-500 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4 font-sharp bg-gradient-to-r from-bright-turquoise to-electric-blue bg-clip-text text-transparent">
            Compte en attente d'approbation
          </h2>
          <p className="mb-4 text-muted-foreground">
            Votre compte a été créé avec succès mais doit être approuvé par un administrateur avant que vous puissiez accéder à l'application.
          </p>
          <p className="text-gray-400 mb-6">
            Vous recevrez un email dès que votre compte sera approuvé.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-gradient-to-r from-bright-turquoise to-electric-blue hover:from-bright-turquoise/80 hover:to-electric-blue/80 text-dark-navy font-semibold rounded transition-colors"
            >
              Retour à l'accueil
            </button>
            <p className="text-xs text-gray-500">
              Compte: {user.firstName} {user.lastName} ({user.email})
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Afficher le contenu protégé
  console.log('✅ [PROTECTED_ROUTE] Utilisateur authentifié, affichage du contenu');
  return <>{children}</>;
};
