
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

  // Vérifier l'approbation si requise (par défaut désactivée maintenant)
  if (requireApproval && user && !user.isApproved) {
    console.log('⚠️ [PROTECTED_ROUTE] Utilisateur non approuvé');
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">Compte en attente d'approbation</h2>
          <p className="mb-4">Votre compte a été créé avec succès mais doit être approuvé par un administrateur avant que vous puissiez accéder à l'application.</p>
          <p className="text-gray-400">Vous recevrez un email dès que votre compte sera approuvé.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-6 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  // Afficher le contenu protégé
  console.log('✅ [PROTECTED_ROUTE] Utilisateur authentifié, affichage du contenu');
  return <>{children}</>;
};
