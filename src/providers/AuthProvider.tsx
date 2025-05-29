
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
    console.log('🚀 [AUTH] AuthProvider initializing with Supabase...');
    
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [AUTH] Auth state changed:', event, session?.user?.id || 'no user');
        
        if (session?.user) {
          // Utilisateur connecté - récupérer le profil
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (error) {
              console.error('❌ [AUTH] Error fetching profile:', error.message);
              setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
              return;
            }

            const user: User = {
              id: profile.id,
              firstName: profile.first_name,
              lastName: profile.last_name,
              email: profile.email,
              phone: profile.phone,
              company: profile.company,
              isApproved: true,
              createdAt: profile.created_at,
            };

            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });

            console.log('✅ [AUTH] User authenticated with profile');
          } catch (error) {
            console.error('💥 [AUTH] Error loading user profile:', error);
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } else {
          // Utilisateur déconnecté
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
          console.log('👋 [AUTH] User logged out');
        }
      }
    );

    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 [AUTH] Initial session check:', session?.user?.id || 'no session');
      // L'état sera mis à jour par le callback onAuthStateChange
    });

    return () => {
      console.log('🧹 [AUTH] Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    const result = await authService.login(data);
    // L'état sera mis à jour automatiquement par onAuthStateChange
    return result.success;
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    return await authService.signup(data);
  };

  const logout = async () => {
    console.log('👋 [AUTH] Logging out user');
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('❌ [AUTH] Logout error:', error.message);
    }
    // L'état sera mis à jour automatiquement par onAuthStateChange
  };

  console.log('📊 [AUTH] Current state:', { 
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
