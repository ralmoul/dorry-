
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
    console.log('🚀 [AUTH] AuthProvider initializing...');
    
    // Check if user is already connected
    const savedUser = localStorage.getItem('dory_user');
    const sessionUser = sessionStorage.getItem('dory_user');
    
    const userToLoad = savedUser || sessionUser;
    
    if (userToLoad) {
      try {
        const user = JSON.parse(userToLoad);
        console.log('✅ [AUTH] User found in storage:', { id: user.id, email: user.email });
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('❌ [AUTH] Error loading user data:', error);
        localStorage.removeItem('dory_user');
        sessionStorage.removeItem('dory_user');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      console.log('ℹ️ [AUTH] No user found in storage');
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    try {
      console.log('🔐 [LOGIN] Starting login process for:', data.email);
      
      // Validate input
      if (!data.email || !data.password) {
        console.error('❌ [LOGIN] Missing email or password');
        return false;
      }

      const cleanEmail = data.email.toLowerCase().trim();
      console.log('🔍 [LOGIN] Searching for user with email:', cleanEmail);
      
      // Query users table directly (no RLS now)
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .limit(1);
      
      console.log('📊 [LOGIN] Query result:', { 
        users: users?.length || 0, 
        error: error?.message || 'none',
        errorCode: error?.code || 'none'
      });
      
      if (error) {
        console.error('❌ [LOGIN] Database error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return false;
      }
      
      if (!users || users.length === 0) {
        console.log('❌ [LOGIN] No user found with email:', cleanEmail);
        return false;
      }
      
      const dbUser = users[0];
      console.log('✅ [LOGIN] User found:', { 
        id: dbUser.id, 
        email: dbUser.email, 
        approved: dbUser.is_approved,
        firstName: dbUser.first_name
      });
      
      // Check if user is approved
      if (!dbUser.is_approved) {
        console.log('❌ [LOGIN] User not approved yet');
        return false;
      }
      
      // Check password
      if (data.password !== dbUser.password_hash) {
        console.log('❌ [LOGIN] Invalid password');
        return false;
      }
      
      console.log('🎉 [LOGIN] Authentication successful!');
      
      // Create user object
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
      
      // Update auth state
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      // Store user data
      localStorage.removeItem('dory_user');
      sessionStorage.removeItem('dory_user');
      
      if (data.rememberMe) {
        console.log('💾 [LOGIN] Storing in localStorage (persistent)');
        localStorage.setItem('dory_user', JSON.stringify(user));
        localStorage.setItem('dory_remember_me', 'true');
      } else {
        console.log('🔄 [LOGIN] Storing in sessionStorage (session only)');
        sessionStorage.setItem('dory_user', JSON.stringify(user));
        localStorage.setItem('dory_remember_me', 'false');
      }
      
      console.log('✅ [LOGIN] Login process completed successfully');
      return true;
      
    } catch (error) {
      console.error('💥 [LOGIN] Unexpected error:', error);
      return false;
    }
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    try {
      console.log('📝 [SIGNUP] Starting signup process for:', data.email);
      
      // Validate all required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'company', 'password'];
      const missingFields = requiredFields.filter(field => !data[field as keyof SignupFormData]?.trim());
      
      if (missingFields.length > 0) {
        console.error('❌ [SIGNUP] Missing required fields:', missingFields);
        return false;
      }
      
      const cleanEmail = data.email.toLowerCase().trim();
      console.log('🔍 [SIGNUP] Checking if email exists:', cleanEmail);
      
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', cleanEmail)
        .limit(1);
      
      console.log('📊 [SIGNUP] Email check result:', { 
        existing: existingUsers?.length || 0, 
        error: checkError?.message || 'none' 
      });
      
      if (checkError) {
        console.error('❌ [SIGNUP] Error checking existing email:', checkError);
        return false;
      }
      
      if (existingUsers && existingUsers.length > 0) {
        console.error('❌ [SIGNUP] Email already exists');
        return false;
      }
      
      console.log('✅ [SIGNUP] Email available, creating user...');
      
      // Create new user
      const newUserData = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: cleanEmail,
        phone: data.phone.trim(),
        company: data.company.trim(),
        password_hash: data.password, // Plain text for now
        is_approved: false
      };
      
      console.log('📝 [SIGNUP] Inserting user data:', { 
        ...newUserData, 
        password_hash: '[HIDDEN]' 
      });
      
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([newUserData])
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ [SIGNUP] Insert error:', {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details
        });
        return false;
      }
      
      console.log('🎉 [SIGNUP] User created successfully:', { 
        id: newUser.id, 
        email: newUser.email 
      });
      
      return true;
      
    } catch (error) {
      console.error('💥 [SIGNUP] Unexpected error:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('👋 [AUTH] Logging out user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('dory_user');
    sessionStorage.removeItem('dory_user');
    localStorage.removeItem('dory_remember_me');
  };

  console.log('📊 [AUTH] Current state:', { 
    isAuthenticated: authState.isAuthenticated, 
    isLoading: authState.isLoading,
    userId: authState.user?.id || 'none'
  });

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
    console.error('❌ [AUTH] useAuth called outside of AuthProvider');
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
