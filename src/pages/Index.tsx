import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { DorryDashboard } from '@/components/ui/dashboard-with-collapsible-sidebar';

const Index = () => {
  const {
    user,
    logout,
    isAuthenticated,
    isLoading
  } = useAuth();
  const navigate = useNavigate();

  // Protection d'authentification améliorée
  useEffect(() => {
    console.log('🔍 [INDEX] Checking authentication status:', {
      isLoading,
      isAuthenticated,
      hasUser: !!user,
      userApproved: user?.isApproved
    });
    
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        console.log('❌ [INDEX] User not authenticated, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }
      console.log('✅ [INDEX] User is authenticated');
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  // Afficher un loader pendant la vérification d'authentification
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-orange-300">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si pas authentifié, ne rien afficher (redirection en cours)
  if (!isAuthenticated || !user) {
    return null;
  }

  return <DorryDashboard />;
};

export default Index;
