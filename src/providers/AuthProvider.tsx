
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
    console.log('🚀 [AUTH] AuthProvider initializing...');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [AUTH] Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          const user = {
            id: session.user.id,
            firstName: session.user.user_metadata?.first_name || '',
            lastName: session.user.user_metadata?.last_name || '',
            email: session.user.email || '',
            phone: session.user.user_metadata?.phone || '',
            company: session.user.user_metadata?.company || '',
            isApproved: true, // Tous les utilisateurs sont approuvés automatiquement
            createdAt: session.user.created_at,
          };
          
          console.log('✅ [AUTH] User authenticated:', user.email);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          console.log('🚪 [AUTH] No session, user logged out');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 [AUTH] Initial session check:', session?.user?.id || 'none');
      if (!session) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    console.log('🔐 [AUTH] Starting login process for:', data.email);
    return authService.login(data);
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    console.log('📝 [AUTH] Starting signup process for:', data.email);
    return authService.signup(data);
  };

  const logout = async () => {
    console.log('👋 [AUTH] Logging out user');
    await supabase.auth.signOut();
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
