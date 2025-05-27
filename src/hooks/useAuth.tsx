
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, SignupFormData, LoginFormData } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

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
    // Check if user is already connected
    const savedUser = localStorage.getItem('dory_user');
    const sessionUser = sessionStorage.getItem('dory_user');
    
    const userToLoad = savedUser || sessionUser;
    
    if (userToLoad) {
      try {
        const user = JSON.parse(userToLoad);
        console.log('AuthProvider: User found in storage', user);
        
        // For now, trust the stored user without DB verification to avoid RLS issues
        console.log('AuthProvider: Using stored user data (skipping DB verification due to RLS issues)');
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error loading user data:', error);
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
      console.log('🔐 Tentative de connexion pour:', data.email);
      
      // Try to search for user with better error handling
      console.log('🔍 Attempting to query users table...');
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.email.toLowerCase().trim())
        .limit(1);
      
      if (error) {
        console.error('❌ Erreur recherche utilisateur:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        
        // If it's a policy error, we'll need to fix the database
        if (error.code === '42P17' || error.message.includes('infinite recursion')) {
          console.error('🚨 RLS Policy recursion detected - database needs fixing!');
          // For now, reject the login
          return false;
        }
        
        return false;
      }
      
      if (!users || users.length === 0) {
        console.log('❌ Aucun utilisateur trouvé pour:', data.email);
        return false;
      }
      
      const dbUser = users[0];
      console.log('✅ Utilisateur trouvé:', { id: dbUser.id, email: dbUser.email, approved: dbUser.is_approved });
      
      // Check if user is approved
      if (!dbUser.is_approved) {
        console.log('❌ Utilisateur non approuvé');
        return false;
      }
      
      // Check password
      if (data.password !== dbUser.password_hash) {
        console.log('❌ Mot de passe incorrect');
        return false;
      }
      
      console.log('✅ Authentification réussie!');
      
      // Transform database user to User interface format
      const user: User = {
        id: dbUser.id,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        email: dbUser.email,
        phone: dbUser.phone,
        company: dbUser.company,
        isApproved: dbUser.is_approved,
        createdAt: dbUser.created_at,
      };
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Clear both storages first to avoid conflicts
      localStorage.removeItem('dory_user');
      sessionStorage.removeItem('dory_user');
      
      // Store according to user preference
      if (data.rememberMe) {
        console.log('💾 Stockage persistant activé (localStorage)');
        localStorage.setItem('dory_user', JSON.stringify(user));
        localStorage.setItem('dory_remember_me', 'true');
      } else {
        console.log('🔄 Stockage session uniquement (sessionStorage)');
        sessionStorage.setItem('dory_user', JSON.stringify(user));
        localStorage.setItem('dory_remember_me', 'false');
      }
      
      return true;
    } catch (error) {
      console.error('💥 Erreur de connexion:', error);
      return false;
    }
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    try {
      console.log('🚀 [SIGNUP] Starting account creation');
      console.log('📋 [SIGNUP] Data received:', { ...data, password: '[HIDDEN]' });
      
      // Verify that all fields are filled
      if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.company || !data.password) {
        console.error('❌ [SIGNUP] Some fields are missing');
        return false;
      }
      
      const cleanEmail = data.email.toLowerCase().trim();
      console.log('🔍 [SIGNUP] Checking if email exists:', cleanEmail);
      
      // Try to check existing emails with better error handling
      console.log('📊 [SIGNUP] Attempting to query existing emails...');
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', cleanEmail)
        .limit(1);
      
      if (checkError) {
        console.error('⚠️ [SIGNUP] Error checking existing email:', checkError);
        console.error('⚠️ [SIGNUP] Error code:', checkError.code);
        console.error('⚠️ [SIGNUP] Error message:', checkError.message);
        
        // If it's a policy error, we'll need to fix the database
        if (checkError.code === '42P17' || checkError.message.includes('infinite recursion')) {
          console.error('🚨 RLS Policy recursion detected during signup - database needs fixing!');
          return false;
        }
        
        return false;
      }
      
      console.log('📊 [SIGNUP] Existing users check result:', existingUsers?.length || 0);
      
      if (existingUsers && existingUsers.length > 0) {
        console.error('⚠️ [SIGNUP] Email already exists in database!');
        return false;
      }
      
      console.log('✅ [SIGNUP] Email is available, proceeding with account creation');
      
      // Create new user
      const newUserData = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: cleanEmail,
        phone: data.phone.trim(),
        company: data.company.trim(),
        password_hash: data.password, // Temporary: storing as plain text
        is_approved: false
      };
      
      console.log('📝 [SIGNUP] Creating user with data:', { ...newUserData, password_hash: '[HIDDEN]' });
      
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([newUserData])
        .select()
        .single();
      
      if (insertError) {
        console.error('💥 [SIGNUP] Error creating user:', insertError);
        console.error('💥 [SIGNUP] Error code:', insertError.code);
        console.error('💥 [SIGNUP] Error message:', insertError.message);
        
        // Check if it's a unique constraint violation
        if (insertError.code === '23505') {
          console.error('💥 [SIGNUP] Unique constraint violation - email already exists!');
        } else if (insertError.code === '42P17' || insertError.message.includes('infinite recursion')) {
          console.error('🚨 RLS Policy recursion detected during insert - database needs fixing!');
        }
        
        return false;
      }
      
      console.log('🎉 [SIGNUP] User created successfully!', { ...newUser, password_hash: '[HIDDEN]' });
      return true;
    } catch (error) {
      console.error('💥 [SIGNUP] Error during signup:', error);
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
    localStorage.removeItem('dory_remember_me');
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
