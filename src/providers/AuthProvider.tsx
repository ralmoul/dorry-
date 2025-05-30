
import { ReactNode, useState, useEffect } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { AuthState, SignupFormData, LoginFormData } from '@/types/auth';
import { authService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('🚀 [AUTH] AuthProvider initializing with Supabase...');
    
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AUTH] Auth state changed:', event);
      
      if (session?.user) {
        // Récupérer le profil utilisateur
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const user = {
            id: session.user.id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email,
            phone: profile.phone,
            company: profile.company,
            isApproved: true,
            createdAt: profile.created_at,
          };

          console.log('✅ [AUTH] User authenticated:', user.firstName);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        console.log('❌ [AUTH] User logged out');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    console.log('🔐 [AUTH] Login attempt for:', data.email);
    const result = await authService.login(data);
    return result.success;
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    return await authService.signup(data);
  };

  const logout = async () => {
    console.log('👋 [AUTH] Logging out user');
    await supabase.auth.signOut();
  };

  console.log('📊 [AUTH] Current provider state:', { 
    isAuthenticated: authState.isAuthenticated, 
    isLoading: authState.isLoading,
    userId: authState.user?.id || 'none',
    userFirstName: authState.user?.firstName || 'none'
  });

  const contextValue: AuthContextType = {
    ...authState,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
