
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

      if (session?.user) {
        console.log('👤 [AUTH_PROVIDER] Session utilisateur trouvée:', session.user.id);
        
        try {
          console.log('🔍 [AUTH_PROVIDER] Recherche du profil pour:', session.user.id);
          
          // Requête rapide avec timeout de 3 secondes
          const profilePromise = supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Profile fetch timeout')), 3000)
          );

          const { data: profile, error: profileError } = await Promise.race([
            profilePromise,
            timeoutPromise
          ]) as any;

          console.log('📊 [AUTH_PROVIDER] Résultat de la requête profil:', { profile, profileError });

          if (!mounted) return;

          if (profile && !profileError) {
            const user = {
              id: session.user.id,
              firstName: profile.first_name || '',
              lastName: profile.last_name || '',
              email: profile.email || session.user.email,
              phone: profile.phone || '',
              company: profile.company || '',
              isApproved: profile.is_approved === true, // Force boolean
              createdAt: profile.created_at,
            };

            console.log('✅ [AUTH_PROVIDER] Profil utilisateur récupéré:', {
              firstName: user.firstName,
              isApproved: user.isApproved
            });
            
            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            // Créer un utilisateur de base avec approbation par défaut
            console.warn('⚠️ [AUTH_PROVIDER] Erreur profil, création utilisateur de base');
            const user = {
              id: session.user.id,
              firstName: session.user.user_metadata?.first_name || '',
              lastName: session.user.user_metadata?.last_name || '',
              email: session.user.email || '',
              phone: session.user.user_metadata?.phone || '',
              company: session.user.user_metadata?.company || '',
              isApproved: true, // Approuvé par défaut pour éviter le blocage
              createdAt: new Date().toISOString(),
            };

            console.log('🔧 [AUTH_PROVIDER] Utilisation utilisateur de base:', user);

            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('💥 [AUTH_PROVIDER] Erreur lors de la récupération du profil:', error);
          if (mounted) {
            // En cas d'erreur, on authentifie avec approbation par défaut
            const user = {
              id: session.user.id,
              firstName: session.user.user_metadata?.first_name || '',
              lastName: session.user.user_metadata?.last_name || '',
              email: session.user.email || '',
              phone: session.user.user_metadata?.phone || '',
              company: session.user.user_metadata?.company || '',
              isApproved: true, // Approuvé par défaut
              createdAt: new Date().toISOString(),
            };

            setAuthState({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        }
      } else {
        console.log('❌ [AUTH_PROVIDER] Aucune session utilisateur');
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    // Vérifier la session actuelle au démarrage
    const checkInitialSession = async () => {
      try {
        console.log('🔍 [AUTH_PROVIDER] Vérification de la session initiale...');
        
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (error) {
          console.error('❌ [AUTH_PROVIDER] Erreur lors de la récupération de la session:', error);
          if (mounted) {
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
          return;
        }
        
        console.log('🔍 [AUTH_PROVIDER] Session initiale trouvée:', !!session);
        await updateAuthState(session);
      } catch (error) {
        console.error('💥 [AUTH_PROVIDER] Erreur lors de la vérification:', error);
        if (mounted) {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AUTH_PROVIDER] Changement d\'état auth:', event);
      await updateAuthState(session);
    });

    checkInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> => {
    console.log('🔐 [AUTH_PROVIDER] Tentative de connexion pour:', data.email);
    try {
      const loginPromise = authService.login(data);
      const timeoutPromise = new Promise<{ success: boolean }>((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout')), 10000)
      );

      const result = await Promise.race([loginPromise, timeoutPromise]);
      console.log('🔐 [AUTH_PROVIDER] Résultat de la connexion:', result);
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
    console.log('👋 [AUTH_PROVIDER] Début de la déconnexion utilisateur...');
    try {
      // Mettre à jour l'état immédiatement pour l'UI
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Effectuer la déconnexion Supabase
      await authService.logout();
      
      console.log('✅ [AUTH_PROVIDER] Déconnexion terminée');
    } catch (error) {
      console.error('❌ [AUTH_PROVIDER] Erreur lors de la déconnexion:', error);
      // Même en cas d'erreur, on force la déconnexion côté client
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
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
