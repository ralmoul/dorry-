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
    console.log('🚀 [AUTH_PROVIDER] Initialisation...');
    
    let mounted = true;

    // Fonction pour mettre à jour l'état d'authentification
    const updateAuthState = async (session: any) => {
      if (!mounted) return;

      console.log('🔄 [AUTH_PROVIDER] Mise à jour de l\'état d\'authentification...');

      try {
        if (session?.user) {
          console.log('✅ [AUTH_PROVIDER] Session utilisateur trouvée:', session.user.id);
          
          // Récupérer le profil utilisateur depuis la table profiles
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('❌ [AUTH_PROVIDER] Erreur lors de la récupération du profil:', error);
            // Utiliser les données de session de base si le profil n'existe pas
            const user = {
              id: session.user.id,
              firstName: session.user.user_metadata?.first_name || '',
              lastName: session.user.user_metadata?.last_name || '',
              email: session.user.email || '',
              phone: session.user.user_metadata?.phone || '',
              company: session.user.user_metadata?.company || '',
              isApproved: true, // Par défaut approuvé si pas de profil
              createdAt: session.user.created_at || new Date().toISOString(),
            };

            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }

          console.log('✅ [AUTH_PROVIDER] Profil utilisateur récupéré:', profile);
          
          const user = {
            id: profile.id,
            firstName: profile.first_name,
            lastName: profile.last_name,
            email: profile.email,
            phone: profile.phone,
            company: profile.company,
            isApproved: profile.is_approved,
            createdAt: profile.created_at,
          };

          console.log('✅ [AUTH_PROVIDER] Utilisateur authentifié:', user.firstName, 'Approuvé:', user.isApproved);
          
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          console.log('❌ [AUTH_PROVIDER] Aucune session utilisateur');
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('💥 [AUTH_PROVIDER] Erreur inattendue:', error);
        // S'assurer que le loading s'arrête même en cas d'erreur
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    // Vérifier la session initiale
    const checkInitialSession = async () => {
      try {
        console.log('🔍 [AUTH_PROVIDER] Vérification session initiale...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AUTH_PROVIDER] Erreur session:', error);
          if (mounted) {
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
          return;
        }
        
        console.log('🔍 [AUTH_PROVIDER] Session trouvée:', !!session);
        await updateAuthState(session);
      } catch (error) {
        console.error('💥 [AUTH_PROVIDER] Erreur vérification:', error);
        if (mounted) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    };

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AUTH_PROVIDER] Changement auth:', event);
      await updateAuthState(session);
    });

    checkInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    console.log('🔐 [AUTH_PROVIDER] Tentative connexion:', data.email);
    try {
      const result = await authService.login(data);
      console.log('🔐 [AUTH_PROVIDER] Résultat connexion:', result);
      
      if (!result.success && result.error) {
        throw new Error(result.error);
      }
      
      return result.success;
    } catch (error) {
      console.error('❌ [AUTH_PROVIDER] Erreur connexion:', error);
      throw error;
    }
  };

  const signup = async (data: SignupFormData): Promise<boolean> => {
    console.log('📝 [AUTH_PROVIDER] Tentative inscription:', data.email);
    return await authService.signup(data);
  };

  const logout = async () => {
    console.log('👋 [AUTH_PROVIDER] Début déconnexion...');
    try {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      await authService.logout();
      console.log('✅ [AUTH_PROVIDER] Déconnexion terminée');
    } catch (error) {
      console.error('❌ [AUTH_PROVIDER] Erreur déconnexion:', error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  console.log('📊 [AUTH_PROVIDER] État actuel:', { 
    isAuthenticated: authState.isAuthenticated, 
    isLoading: authState.isLoading,
    userId: authState.user?.id || 'aucun',
    userFirstName: authState.user?.firstName || 'aucun',
    isApproved: authState.user?.isApproved || false
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
