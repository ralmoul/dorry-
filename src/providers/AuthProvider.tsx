
import { ReactNode, useState, useEffect } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { AuthState, SignupFormData, LoginFormData, User } from '@/types/auth';
import { authService } from '@/services/authService';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from '@/utils/authStorage';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('🚀 [AUTH] AuthProvider initialisation...');
    
    // Vérifier si l'utilisateur est déjà connecté (stockage local)
    const storedAuth = getStoredAuth();
    if (storedAuth) {
      console.log('✅ [AUTH] Utilisateur trouvé dans le stockage:', storedAuth.id);
      setAuthState({
        user: storedAuth,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      console.log('❌ [AUTH] Aucun utilisateur dans le stockage');
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    const result = await authService.login(data);
    
    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Stocker l'utilisateur localement si "se souvenir de moi" est coché
      if (data.rememberMe) {
        setStoredAuth(result.user);
      }
      
      console.log('✅ [AUTH] Utilisateur connecté avec ID:', result.user.id);
      return true;
    }
    
    return false;
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    return await authService.signup(data);
  };

  const logout = async () => {
    console.log('👋 [AUTH] Déconnexion');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    clearStoredAuth();
  };

  console.log('📊 [AUTH] État actuel:', { 
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
