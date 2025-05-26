
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, SignupFormData, LoginFormData } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import bcrypt from 'bcryptjs';

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
      console.log('Login attempt for:', data.email);
      
      // Search for user in Supabase
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.email)
        .eq('is_approved', true);
      
      if (error) {
        console.error('Error searching user:', error);
        return false;
      }
      
      if (!users || users.length === 0) {
        console.log('User not found or not approved');
        return false;
      }
      
      const user = users[0];
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(data.password, user.password_hash);
      
      if (!isPasswordValid) {
        console.log('Invalid password');
        return false;
      }
      
      console.log('User found and approved:', user);
      
      // Remove password from user object
      const { password_hash, ...userWithoutPassword } = user;
      
      setAuthState({
        user: userWithoutPassword,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Store according to user preference
      if (data.rememberMe) {
        localStorage.setItem('dory_user', JSON.stringify(userWithoutPassword));
      } else {
        sessionStorage.setItem('dory_user', JSON.stringify(userWithoutPassword));
      }
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
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
      
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email);
      
      if (checkError) {
        console.error('⚠️ [SIGNUP] Error checking existing email:', checkError);
        return false;
      }
      
      if (existingUsers && existingUsers.length > 0) {
        console.error('⚠️ [SIGNUP] Email already in use:', data.email);
        return false;
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(data.password, 10);
      
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([
          {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            phone: data.phone,
            company: data.company,
            password_hash: passwordHash,
            is_approved: false
          }
        ])
        .select()
        .single();
      
      if (insertError) {
        console.error('💥 [SIGNUP] Error creating user:', insertError);
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
