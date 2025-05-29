
import { ReactNode, useState, useEffect } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { AuthState, SignupFormData, LoginFormData, User } from '@/types/auth';
import { authService } from '@/services/authService';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('🚀 [AUTH] AuthProvider initialisation locale...');
    
    // Vérifier si un utilisateur est stocké localement
    const storedUser = localStorage.getItem('dorry_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        console.log('✅ [AUTH] Utilisateur local restauré:', user.firstName, user.email);
      } catch (error) {
        console.error('❌ [AUTH] Erreur parsing utilisateur local:', error);
        localStorage.removeItem('dorry_user');
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
      console.log('❌ [AUTH] Aucun utilisateur local trouvé');
    }
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    console.log('🔑 [AUTH] Tentative de connexion pour:', data.email);
    const result = await authService.login(data);
    
    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Stocker l'utilisateur localement
      localStorage.setItem('dorry_user', JSON.stringify(result.user));
      console.log('✅ [AUTH] Utilisateur connecté et stocké localement');
    }
    
    console.log('🔑 [AUTH] Résultat connexion:', result.success ? 'succès' : 'échec');
    return result.success;
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    console.log('📝 [AUTH] Tentative d\'inscription pour:', data.email);
    return await authService.signup(data);
  };

  const logout = async () => {
    console.log('👋 [AUTH] Déconnexion locale');
    localStorage.removeItem('dorry_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  console.log('📊 [AUTH] État actuel local:', { 
    isAuthenticated: authState.isAuthenticated, 
    isLoading: authState.isLoading,
    userId: authState.user?.id || 'none',
    userName: authState.user?.firstName || 'none'
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
