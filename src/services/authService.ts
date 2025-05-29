
import { supabase } from '@/integrations/supabase/client';
import { User, SignupFormData, LoginFormData } from '@/types/auth';

export const authService = {
  async login(data: LoginFormData & { rememberMe?: boolean }): Promise<{ success: boolean; user?: User }> {
    try {
      console.log('🔐 [LOGIN] Tentative de connexion Supabase pour:', data.email);
      
      // Utiliser l'authentification Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        console.error('❌ [LOGIN] Erreur authentification Supabase:', authError.message);
        return { success: false };
      }

      if (!authData.user) {
        console.error('❌ [LOGIN] Aucun utilisateur retourné');
        return { success: false };
      }

      // Récupérer le profil utilisateur
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profileData) {
        console.error('❌ [LOGIN] Profil non trouvé:', profileError?.message);
        return { success: false };
      }

      // Créer l'objet user
      const user: User = {
        id: profileData.id,
        firstName: profileData.first_name,
        lastName: profileData.last_name,
        email: profileData.email,
        phone: profileData.phone,
        company: profileData.company,
        isApproved: true, // Les utilisateurs Supabase sont automatiquement approuvés
        createdAt: profileData.created_at,
      };

      console.log('✅ [LOGIN] Connexion Supabase réussie avec ID:', user.id);
      return { success: true, user };

    } catch (error) {
      console.error('💥 [LOGIN] Erreur inattendue Supabase:', error);
      return { success: false };
    }
  },

  async signup(data: SignupFormData): Promise<boolean> {
    try {
      console.log('📝 [SIGNUP] Création de compte Supabase pour:', data.email);
      
      // Créer l'utilisateur avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone,
            company: data.company,
          }
        }
      });

      if (authError) {
        console.error('❌ [SIGNUP] Erreur création Supabase:', authError.message);
        return false;
      }

      if (!authData.user) {
        console.error('❌ [SIGNUP] Aucun utilisateur créé');
        return false;
      }

      console.log('🎉 [SIGNUP] Utilisateur Supabase créé avec ID:', authData.user.id);
      return true;

    } catch (error) {
      console.error('💥 [SIGNUP] Erreur inattendue Supabase:', error);
      return false;
    }
  }
};
