
import { ReactNode, useState, useEffect } from 'react';
import { AuthContext, AuthContextType } from '@/contexts/AuthContext';
import { AuthState, SignupFormData, LoginFormData } from '@/types/auth';
import { authService } from '@/services/authService';
import { supabase } from '@/integrations/supabase/client';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    console.log('🚀 [AUTH_PROVIDER] Initialisation avec Supabase...');
    
    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AUTH_PROVIDER] Changement d\'état auth:', event, 'Session:', !!session);
      
      if (session?.user) {
        console.log('👤 [AUTH_PROVIDER] Session utilisateur trouvée, récupération du profil...');
        
        try {
          // Récupérer le profil utilisateur
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && !profileError) {
            const user = {
              id: session.user.id,
              firstName: profile.first_name,
              lastName: profile.last_name,
              email: profile.email,
              phone: profile.phone,
              company: profile.company,
              isApproved: profile.is_approved,
              createdAt: profile.created_at,
            };

            console.log('✅ [AUTH_PROVIDER] Utilisateur authentifié:', user.firstName, 'Approuvé:', user.isApproved);
            
            if (user.isApproved) {
              setAuthState({
                user,
                isAuthenticated: true,
                isLoading: false,
              });
            } else {
              console.warn('⚠️ [AUTH_PROVIDER] Utilisateur non approuvé, déconnexion...');
              await supabase.auth.signOut();
              setAuthState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } else {
            console.warn('⚠️ [AUTH_PROVIDER] Profil non trouvé, déconnexion...');
            console.error('Profile error:', profileError);
            await supabase.auth.signOut();
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('💥 [AUTH_PROVIDER] Erreur lors de la récupération du profil:', error);
          await supabase.auth.signOut();
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        console.log('❌ [AUTH_PROVIDER] Aucune session utilisateur');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    // Vérifier la session actuelle
    const checkSession = async () => {
      try {
        console.log('🔍 [AUTH_PROVIDER] Vérification de la session existante...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AUTH_PROVIDER] Erreur lors de la récupération de la session:', error);
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }
        
        if (!session) {
          console.log('📭 [AUTH_PROVIDER] Aucune session existante trouvée');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
        // Si une session existe, elle sera gérée par onAuthStateChange
      } catch (error) {
        console.error('💥 [AUTH_PROVIDER] Erreur inattendue lors de la vérification:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkSession();

    return () => subscription.unsubscribe();
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    console.log('🔐 [AUTH_PROVIDER] Tentative de connexion pour:', data.email);
    try {
      const result = await authService.login(data);
      return result.success;
    } catch (error) {
      console.error('❌ [AUTH_PROVIDER] Erreur de connexion:', error);
      return false;
    }
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    console.log('📝 [AUTH_PROVIDER] Tentative d\'inscription pour:', data.email);
    return await authService.signup(data);
  };

  const logout = async () => {
    console.log('👋 [AUTH_PROVIDER] Déconnexion de l\'utilisateur');
    await supabase.auth.signOut();
  };

  console.log('📊 [AUTH_PROVIDER] État actuel du provider:', { 
    isAuthenticated: authState.isAuthenticated, 
    isLoading: authState.isLoading,
    userId: authState.user?.id || 'aucun',
    userFirstName: authState.user?.firstName || 'aucun',
    isApproved: authState.user?.isApproved
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
