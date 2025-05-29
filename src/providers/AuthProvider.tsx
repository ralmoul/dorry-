
import { ReactNode, useState, useEffect } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { AuthState, SignupFormData, LoginFormData, User } from '@/types/auth';
import { authService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('🚀 [AUTH] AuthProvider initialisation Supabase...');
    
    // Écouter les changements d'état d'authentification Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [AUTH] Changement d\'état Supabase:', event, session?.user?.id);
        
        if (session?.user) {
          // Récupérer le profil utilisateur
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileData && !error) {
            const user: User = {
              id: profileData.id,
              firstName: profileData.first_name,
              lastName: profileData.last_name,
              email: profileData.email,
              phone: profileData.phone,
              company: profileData.company,
              isApproved: true,
              createdAt: profileData.created_at,
            };

            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            console.log('✅ [AUTH] Utilisateur Supabase connecté:', user.id);
          } else {
            console.error('❌ [AUTH] Erreur récupération profil:', error?.message);
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          console.log('❌ [AUTH] Aucune session Supabase');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    const result = await authService.login(data);
    return result.success;
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    return await authService.signup(data);
  };

  const logout = async () => {
    console.log('👋 [AUTH] Déconnexion Supabase');
    await supabase.auth.signOut();
  };

  console.log('📊 [AUTH] État actuel Supabase:', { 
    isAuthenticated: authState.isAuthenticated, 
    isLoading: authState.isLoading,
    userId: authState.user?.id || 'none'
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
