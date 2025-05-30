
import { ReactNode, useState, useEffect } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { AuthState, SignupFormData, LoginFormData } from '@/types/auth';
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
    
    const user = authStorage.loadUser();
    console.log('📊 [AUTH] Loaded user from storage:', user);
    
    if (user) {
      // Vérifier le statut actuel de l'utilisateur dans Supabase
      checkUserStatus(user.id);
    } else {
      console.log('❌ [AUTH] No user found, setting unauthenticated state');
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }

    // Setup realtime subscription pour les changements de profil
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    console.log('📡 [AUTH] Setting up realtime subscription for profile changes');
    
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
    const updatedProfile = payload.new;
    const currentUser = authState.user;
    
    if (currentUser && currentUser.id === updatedProfile.id) {
      console.log('🔄 [AUTH] Current user profile updated:', updatedProfile.status);
      
      if (updatedProfile.status === 'approved') {
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
        
      } else if (updatedProfile.status === 'rejected' || updatedProfile.status === 'pending') {
        // Utilisateur rejeté ou mis en attente, déconnecter
        console.log('❌ [AUTH] User status changed to:', updatedProfile.status);
        logout();
      }
    }
  };

  const checkUserStatus = async (userId: string) => {
    try {
      console.log('🔍 [AUTH] Checking user status for:', userId);
      
      const { data: userProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error || !userProfile) {
        console.error('❌ [AUTH] Error checking user status:', error);
        logout();
        return;
      }
      
      console.log('📊 [AUTH] User status check result:', userProfile.status);
      
      if (userProfile.status === 'approved') {
        const user = {
          id: userProfile.id,
          firstName: userProfile.first_name,
          lastName: userProfile.last_name,
          email: userProfile.email,
          phone: userProfile.phone,
          company: userProfile.company,
          isApproved: true,
          createdAt: userProfile.created_at,
        };
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        authStorage.saveUser(user, true);
      } else {
        console.log('❌ [AUTH] User not approved, status:', userProfile.status);
        logout();
      }
      
    } catch (error) {
      console.error('💥 [AUTH] Unexpected error checking user status:', error);
      logout();
    }
  };

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<{ success: boolean; message?: string }> => {
    console.log('🔐 [AUTH] Login attempt for:', data.email);
    const result = await authService.login(data);
    
    if (result.success && result.user) {
      console.log('✅ [AUTH] Login successful, updating state');
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

  const logout = () => {
    console.log('👋 [AUTH] Logging out user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    authStorage.clearUser();
  };

  console.log('📊 [AUTH] Current provider state:', { 
    isAuthenticated: authState.isAuthenticated, 
    isLoading: authState.isLoading,
    userId: authState.user?.id || 'none',
    userFirstName: authState.user?.firstName || 'none'
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
