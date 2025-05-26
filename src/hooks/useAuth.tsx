import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, SignupFormData, LoginFormData } from '@/types/auth';

interface AuthContextType extends AuthState {
  login: (data: LoginFormData & { rememberMe?: boolean }) => Promise<boolean>;
  signup: (data: SignupFormData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('AuthProvider: Initializing auth state');
    // Vérifier si l'utilisateur est déjà connecté
    const savedUser = localStorage.getItem('dory_user');
    const sessionUser = sessionStorage.getItem('dory_user');
    
    const userToLoad = savedUser || sessionUser;
    
    if (userToLoad) {
      try {
        const user = JSON.parse(userToLoad);
        console.log('AuthProvider: User found in storage', user);
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
        localStorage.removeItem('dory_user');
        sessionStorage.removeItem('dory_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      console.log('AuthProvider: No user found in storage');
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    try {
      console.log('Tentative de connexion pour:', data.email);
      // Simuler une authentification
      const users = JSON.parse(localStorage.getItem('dory_users') || '[]');
      console.log('Utilisateurs trouvés:', users);
      const user = users.find((u: any) => u.email === data.email && u.password === data.password);
      
      if (user && user.isApproved) {
        console.log('Utilisateur trouvé et approuvé:', user);
        const { password, ...userWithoutPassword } = user;
        setAuthState({
          user: userWithoutPassword,
          isAuthenticated: true,
          isLoading: false,
        });
        
        // Stocker selon la préférence de l'utilisateur
        if (data.rememberMe) {
          localStorage.setItem('dory_user', JSON.stringify(userWithoutPassword));
        } else {
          sessionStorage.setItem('dory_user', JSON.stringify(userWithoutPassword));
        }
        
        return true;
      }
      console.log('Utilisateur non trouvé ou non approuvé');
      return false;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    try {
      console.log('🚀 [SIGNUP] Début de la création de compte');
      console.log('📋 [SIGNUP] Données reçues:', { ...data, password: '[HIDDEN]' });
      
      // Vérifier que tous les champs sont remplis
      if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.company || !data.password) {
        console.error('❌ [SIGNUP] Certains champs sont manquants:', {
          firstName: !!data.firstName,
          lastName: !!data.lastName,
          email: !!data.email,
          phone: !!data.phone,
          company: !!data.company,
          password: !!data.password
        });
        return false;
      }
      
      // Vérifier si l'email existe déjà
      const existingUsers = JSON.parse(localStorage.getItem('dory_users') || '[]');
      console.log('👥 [SIGNUP] Utilisateurs existants dans localStorage:', existingUsers);
      console.log('📊 [SIGNUP] Nombre d\'utilisateurs existants:', existingUsers.length);
      
      const emailExists = existingUsers.find((u: any) => u.email === data.email);
      
      if (emailExists) {
        console.error('⚠️ [SIGNUP] Email déjà utilisé:', data.email);
        return false;
      }

      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        company: data.company,
        password: data.password,
        isApproved: false,
        createdAt: new Date().toISOString(),
      };

      console.log('✨ [SIGNUP] Nouvel utilisateur créé:', { ...newUser, password: '[HIDDEN]' });

      // Sauvegarder le nouvel utilisateur (en attente d'approbation)
      const users = [...existingUsers, newUser];
      console.log('💾 [SIGNUP] Tentative de sauvegarde, total utilisateurs:', users.length);
      
      localStorage.setItem('dory_users', JSON.stringify(users));
      
      // Vérifier que la sauvegarde a fonctionné
      const savedUsers = JSON.parse(localStorage.getItem('dory_users') || '[]');
      console.log('✅ [SIGNUP] Vérification post-sauvegarde:', savedUsers.length, 'utilisateurs');
      console.log('🔍 [SIGNUP] Dernier utilisateur sauvegardé:', savedUsers[savedUsers.length - 1] ? { ...savedUsers[savedUsers.length - 1], password: '[HIDDEN]' } : 'Aucun');
      
      if (savedUsers.length === users.length) {
        console.log('🎉 [SIGNUP] Sauvegarde réussie !');
        return true;
      } else {
        console.error('💥 [SIGNUP] Erreur de sauvegarde - nombre différent');
        return false;
      }
    } catch (error) {
      console.error('💥 [SIGNUP] Erreur lors de l\'inscription:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('AuthProvider: Logging out user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('dory_user');
    sessionStorage.removeItem('dory_user');
  };

  console.log('AuthProvider: Current auth state', authState);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth called outside of AuthProvider');
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
