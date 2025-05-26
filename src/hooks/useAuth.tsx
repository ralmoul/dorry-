
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
    // Vérifier si l'utilisateur est déjà connecté
    const savedUser = localStorage.getItem('dory_user');
    const sessionUser = sessionStorage.getItem('dory_user');
    
    const userToLoad = savedUser || sessionUser;
    
    if (userToLoad) {
      try {
        const user = JSON.parse(userToLoad);
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
      console.log('Tentative de création de compte pour:', data.email);
      console.log('Données reçues:', data);
      
      // Vérifier que tous les champs sont remplis
      if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.company || !data.password) {
        console.log('Certains champs sont manquants');
        return false;
      }
      
      // Vérifier si l'email existe déjà
      const existingUsers = JSON.parse(localStorage.getItem('dory_users') || '[]');
      console.log('Utilisateurs existants:', existingUsers);
      
      const emailExists = existingUsers.find((u: any) => u.email === data.email);
      
      if (emailExists) {
        console.log('Email déjà utilisé:', data.email);
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

      console.log('Nouvel utilisateur créé:', { ...newUser, password: '[HIDDEN]' });

      // Sauvegarder le nouvel utilisateur (en attente d'approbation)
      const users = [...existingUsers, newUser];
      localStorage.setItem('dory_users', JSON.stringify(users));
      
      console.log('Nombre d\'utilisateurs après sauvegarde:', JSON.parse(localStorage.getItem('dory_users') || '[]').length);
      
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return false;
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('dory_user');
    sessionStorage.removeItem('dory_user');
  };

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
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};
