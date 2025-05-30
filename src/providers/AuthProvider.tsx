
import { ReactNode, useState, useEffect } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { AuthState, SignupFormData, LoginFormData, User, DatabaseProfile } from '@/types/auth';
import { authService } from '@/services/authService';
import { authStorage } from '@/utils/authStorage';
import { supabase } from '@/integrations/supabase/client';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('🚀 [AUTH] AuthProvider initializing...');
    
    // 1️⃣ - Vérifier la session Supabase Auth active
    checkSupabaseSession();

    // 2️⃣ - Setup realtime subscription pour déconnexion automatique si statut change
    setupRealtimeSubscription();
  }, []);

  const checkSupabaseSession = async () => {
    try {
      console.log('🔍 [AUTH] Checking Supabase session...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ [AUTH] Error getting session:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      if (session?.user) {
        console.log('✅ [AUTH] Active Supabase session found:', session.user.id);
        await checkUserStatusStrict(session.user.id);
      } else {
        console.log('❌ [AUTH] No active Supabase session');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('💥 [AUTH] Error checking session:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const setupRealtimeSubscription = () => {
    console.log('📡 [AUTH] Setting up realtime subscription for profile status changes');
    
    const channel = supabase
      .channel('profile-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          console.log('📡 [AUTH] Profile update received:', payload);
          handleProfileUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleProfileUpdate = (payload: any) => {
    const updatedProfile: DatabaseProfile = payload.new;
    const currentUser = authState.user;
    
    if (currentUser && currentUser.id === updatedProfile.id) {
      console.log('🔄 [AUTH] Current user profile updated - checking approval status:', updatedProfile.is_approved);
      
      // 2️⃣ - BLOCAGE STRICT - Seuls les utilisateurs approuvés restent connectés
      if (updatedProfile.is_approved) {
        // Utilisateur approuvé, maintenir la session
        const updatedUser = {
          ...currentUser,
          isApproved: true
        };
        
        setAuthState({
          user: updatedUser,
          isAuthenticated: true,
          isLoading: false,
        });
        
        authStorage.saveUser(updatedUser, true);
        
      } else {
        // Utilisateur désapprouvé ou en attente, déconnecter immédiatement
        console.log('❌ [AUTH] User status changed to not approved - BLOCKING access');
        forceLogout();
      }
    }
  };

  const checkUserStatusStrict = async (userId: string) => {
    try {
      console.log('🔍 [AUTH] STRICT CHECK - Verifying user approval status for:', userId);
      
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !userProfile) {
        console.error('❌ [AUTH] Error checking user status or user not found:', error);
        forceLogout();
        return;
      }
      
      const dbUser: DatabaseProfile = userProfile;
      console.log('📊 [AUTH] User status check result - approved:', dbUser.is_approved);
      
      // 2️⃣ - BLOCAGE STRICT - Seuls les utilisateurs approuvés peuvent rester connectés
      if (dbUser.is_approved) {
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
        
        authStorage.saveUser(user, true);
      } else {
        console.log('❌ [AUTH] STRICT BLOCK - User not approved, access denied');
        forceLogout();
      }
      
    } catch (error) {
      console.error('💥 [AUTH] Unexpected error checking user status:', error);
      forceLogout();
    }
  };

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<{ success: boolean; message?: string }> => {
    console.log('🔐 [AUTH] Login attempt for:', data.email);
    const result = await authService.login(data);
    
    if (result.success && result.user) {
      console.log('✅ [AUTH] Login successful for approved user, updating state');
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      });
      
      authStorage.saveUser(result.user, data.rememberMe || false);
      return { success: true };
    }
    
    console.log('❌ [AUTH] Login failed:', result.message);
    return { success: false, message: result.message };
  };

  const signup = async (data: SignupFormData): Promise<{ success: boolean; message?: string }> => {
    console.log('📝 [AUTH] Signup attempt for:', data.email);
    return await authService.signup(data);
  };

  const forceLogout = async () => {
    console.log('👋 [AUTH] FORCE LOGOUT - Clearing user session');
    // Déconnecter de Supabase Auth
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    authStorage.clearUser();
  };

  const logout = async () => {
    console.log('👋 [AUTH] User logout');
    await forceLogout();
  };

  console.log('📊 [AUTH] Current provider state:', { 
    isAuthenticated: authState.isAuthenticated, 
    isLoading: authState.isLoading,
    userId: authState.user?.id || 'none',
    userFirstName: authState.user?.firstName || 'none',
    userApproved: authState.user?.isApproved || false
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
