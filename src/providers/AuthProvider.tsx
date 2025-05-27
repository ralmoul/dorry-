
import { ReactNode, useState, useEffect } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { AuthState, SignupFormData, LoginFormData } from '@/types/auth';
import { authService } from '@/services/authService';
import { authStorage } from '@/utils/authStorage';
import { supabase } from '@/integrations/supabase/client';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('🚀 [AUTH] AuthProvider initializing...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [AUTH] Auth state changed:', event);
        
        if (session?.user) {
          // Fetch user profile from our custom table
          const { data: userProfile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (userProfile && userProfile.is_approved) {
            const user = {
              id: userProfile.id,
              firstName: userProfile.first_name,
              lastName: userProfile.last_name,
              email: userProfile.email,
              phone: userProfile.phone,
              company: userProfile.company,
              isApproved: userProfile.is_approved,
              createdAt: userProfile.created_at,
            };
            
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // User not approved or profile not found
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
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    });

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
    console.log('👋 [AUTH] Logging out user');
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    authStorage.clearUser();
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
