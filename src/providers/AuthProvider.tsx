
import { ReactNode, useState, useEffect } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { AuthState, SignupFormData, LoginFormData } from '@/types/auth';
import { authService } from '@/services/authService';
import { authStorage } from '@/utils/authStorage';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('🚀 [AUTH] AuthProvider initializing...');
    
    const user = authStorage.loadUser();
    console.log('📊 [AUTH] Loaded user from storage:', user);
    
    if (user) {
      console.log('✅ [AUTH] User found, setting authenticated state');
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      console.log('❌ [AUTH] No user found, setting unauthenticated state');
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    console.log('🔐 [AUTH] Login attempt for:', data.email);
    const result = await authService.login(data);
    
    if (result.success && result.user) {
      console.log('✅ [AUTH] Login successful, updating state');
      // Update auth state
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Store user data
      authStorage.saveUser(result.user, data.rememberMe || false);
      
      return true;
    }
    
    console.log('❌ [AUTH] Login failed');
    return false;
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    return await authService.signup(data);
  };

  const logout = () => {
    console.log('👋 [AUTH] Logging out user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    authStorage.clearUser();
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
