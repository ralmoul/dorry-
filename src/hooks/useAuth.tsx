
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
        
        // Verify the user is still valid in the database
        supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .eq('is_approved', true)
          .single()
          .then(({ data, error }) => {
            if (error || !data) {
              console.log('AuthProvider: User no longer valid, clearing storage');
              localStorage.removeItem('dory_user');
              sessionStorage.removeItem('dory_user');
              setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            } else {
              console.log('AuthProvider: User verified, maintaining session');
              setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            }
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
      
      // Search for user in Supabase
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.email);
      
      if (error) {
        console.error('❌ Erreur recherche utilisateur:', error);
        return false;
      }
      
      if (!users || users.length === 0) {
        console.log('❌ Aucun utilisateur trouvé');
        return false;
      }
      
      const dbUser = users[0];
      
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
        // Also store a flag to remember the preference
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
      
      // Clean and prepare email
      const cleanEmail = data.email.toLowerCase().trim();
      console.log('🔍 [SIGNUP] Checking if email exists:', cleanEmail);
      
      // First, let's check what's in the database
      console.log('📊 [SIGNUP] Querying all users to debug...');
      const { data: allUsers, error: debugError } = await supabase
        .from('users')
        .select('id, email, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (debugError) {
        console.error('⚠️ [SIGNUP] Debug query error:', debugError);
      } else {
        console.log('📊 [SIGNUP] Recent users in database:', allUsers);
      }
      
      // Now check for the specific email
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id, email, created_at')
        .eq('email', cleanEmail);
      
      if (checkError) {
        console.error('⚠️ [SIGNUP] Error checking existing email:', checkError);
        console.error('⚠️ [SIGNUP] Full error details:', JSON.stringify(checkError, null, 2));
        return false;
      }
      
      console.log('📊 [SIGNUP] Query result for email check:', existingUsers);
      console.log('📊 [SIGNUP] Number of existing users found:', existingUsers?.length || 0);
      
      if (existingUsers && existingUsers.length > 0) {
        console.error('⚠️ [SIGNUP] Email already exists in database!');
        console.error('⚠️ [SIGNUP] Existing user data:', existingUsers[0]);
        console.error('⚠️ [SIGNUP] Searched email:', cleanEmail);
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
        console.error('💥 [SIGNUP] Full insert error details:', JSON.stringify(insertError, null, 2));
        
        // Check if it's a unique constraint violation
        if (insertError.code === '23505') {
          console.error('💥 [SIGNUP] Unique constraint violation - email already exists!');
        }
        
        return false;
      }
      
      console.log('🎉 [SIGNUP] User created successfully!', { ...newUser, password_hash: '[HIDDEN]' });
      return true;
    } catch (error) {
      console.error('💥 [SIGNUP] Error during signup:', error);
      console.error('💥 [SIGNUP] Full error details:', JSON.stringify(error, null, 2));
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
