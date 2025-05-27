
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
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 [AUTH] Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          // Fetch user profile from our custom table
          const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          console.log('👤 [AUTH] User profile fetch result:', { userProfile, error });
          
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
            
            console.log('✅ [AUTH] User approved and authenticated:', user.email);
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            console.log('❌ [AUTH] User not approved or profile not found');
            // User not approved or profile not found, sign them out
            await supabase.auth.signOut();
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
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
    const result = await authService.login(data);
    console.log('🎯 [AUTH] Login result:', result.success);
    return result.success;
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    console.log('📝 [AUTH] Starting signup process for:', data.email);
    const result = await authService.signup(data);
    console.log('🎯 [AUTH] Signup result:', result);
    return result;
  };

  const logout = async () => {
    console.log('👋 [AUTH] Logging out user');
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
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
