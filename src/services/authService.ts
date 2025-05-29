
import { supabase } from '@/integrations/supabase/client';
import { User, SignupFormData, LoginFormData } from '@/types/auth';

export const authService = {
  async login(data: LoginFormData & { rememberMe?: boolean }): Promise<{ success: boolean; user?: User }> {
    try {
      console.log('🔐 [LOGIN] Starting Supabase login for:', data.email);
      
      // Utiliser l'authentification Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        console.error('❌ [LOGIN] Supabase auth error:', authError.message);
        return { success: false };
      }

      if (!authData.user) {
        console.error('❌ [LOGIN] No user returned from Supabase');
        return { success: false };
      }

      console.log('✅ [LOGIN] Supabase authentication successful');

      // Récupérer le profil utilisateur depuis la table profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('❌ [LOGIN] Error fetching profile:', profileError.message);
        return { success: false };
      }

      if (!profile) {
        console.error('❌ [LOGIN] No profile found for user');
        return { success: false };
      }

      // Créer l'objet user avec les données du profil
      const user: User = {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        company: profile.company,
        isApproved: true, // Si l'utilisateur peut se connecter, il est approuvé
        createdAt: profile.created_at,
      };

      console.log('🎉 [LOGIN] Login successful with profile data');
      return { success: true, user };

    } catch (error) {
      console.error('💥 [LOGIN] Unexpected error:', error);
      return { success: false };
    }
  },

  async signup(data: SignupFormData): Promise<boolean> {
    try {
      console.log('📝 [SIGNUP] Starting Supabase signup for:', data.email);
      
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
        console.error('❌ [SIGNUP] Supabase signup error:', authError.message);
        return false;
      }

      if (!authData.user) {
        console.error('❌ [SIGNUP] No user created');
        return false;
      }

      console.log('🎉 [SIGNUP] User created successfully with ID:', authData.user.id);
      
      // Le profil sera créé automatiquement par le trigger
      return true;

    } catch (error) {
      console.error('💥 [SIGNUP] Unexpected error:', error);
      return false;
    }
  }
};
