
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
    checkSupabaseSessionStrict();

    // 2️⃣ - Setup realtime subscription pour déconnexion automatique si statut change
    setupRealtimeSubscription();
  }, []);

  const checkSupabaseSessionStrict = async () => {
    try {
      console.log('🔍 [AUTH] STRICT SESSION CHECK - Verifying session and user status...');
      
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ [AUTH] Error getting session:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return;
      }
      
      if (session?.user) {
        console.log('✅ [AUTH] Active Supabase session found:', session.user.id);
        // VÉRIFICATION STRICTE : L'utilisateur doit exister et être approuvé dans notre base
        await checkUserStatusAndApprovalStrict(session.user.id);
      } else {
        console.log('❌ [AUTH] No active Supabase session');
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('💥 [AUTH] Error checking session:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const checkUserStatusAndApprovalStrict = async (userId: string) => {
    try {
      console.log('🔍 [AUTH] STRICT USER CHECK - Must exist and be approved:', userId);
      
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !userProfile) {
        console.error('❌ [AUTH] STRICT BLOCK - User not found in our database:', error);
        forceLogoutImmediate();
        return;
      }
      
      const dbUser: DatabaseProfile = userProfile;
      console.log('📊 [AUTH] User status check result - approved:', dbUser.is_approved);
      
      // BLOCAGE STRICT - Seuls les utilisateurs approuvés peuvent rester connectés
      if (!dbUser.is_approved) {
        console.log('❌ [AUTH] STRICT BLOCK - User not approved, immediate logout');
        forceLogoutImmediate();
        return;
      }
      
      // Utilisateur valide et approuvé
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
      console.log('✅ [AUTH] User validated and authenticated successfully');
      
    } catch (error) {
      console.error('💥 [AUTH] Unexpected error checking user status:', error);
      forceLogoutImmediate();
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
        // Utilisateur désapprouvé, déconnecter immédiatement
        console.log('❌ [AUTH] User status changed to not approved - IMMEDIATE LOGOUT');
        forceLogoutImmediate();
      }
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

  const forceLogoutImmediate = async () => {
    console.log('🚨 [AUTH] IMMEDIATE FORCE LOGOUT - Clearing ALL sessions');
    
    // Déconnecter de Supabase Auth
    await supabase.auth.signOut();
    
    // Nettoyer le state local
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Nettoyer le storage
    authStorage.clearUser();
    
    console.log('✅ [AUTH] All sessions cleared successfully');
  };

  const logout = async () => {
    console.log('👋 [AUTH] User logout');
    await forceLogoutImmediate();
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
