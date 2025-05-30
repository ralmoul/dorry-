
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  async login(data: { email: string; password: string; rememberMe?: boolean }): Promise<{ success: boolean; user?: any }> {
    try {
      console.log('🔐 [LOGIN] Starting Supabase login process for:', data.email);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      if (error) {
        console.error('❌ [LOGIN] Supabase auth error:', error);
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

      if (profileError || !profile) {
        console.error('❌ [LOGIN] Profile not found:', profileError);
        return { success: false };
      }

      const user = {
        id: authData.user.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        company: profile.company,
        isApproved: true, // Si l'utilisateur peut se connecter via Supabase, il est approuvé
        createdAt: profile.created_at,
      };

      return { success: true, user };
      
    } catch (error) {
      console.error('💥 [LOGIN] Unexpected error:', error);
      return { success: false };
    }
  },

  async signup(data: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    phone: string; 
    company: string; 
    password: string; 
  }): Promise<boolean> {
    try {
      console.log('📝 [SIGNUP] Starting Supabase signup process for:', data.email);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        options: {
          data: {
            first_name: data.firstName.trim(),
            last_name: data.lastName.trim(),
            phone: data.phone.trim(),
            company: data.company.trim(),
          }
        }
      });

      if (error) {
        console.error('❌ [SIGNUP] Supabase signup error:', error);
        return false;
      }

      console.log('✅ [SIGNUP] Supabase signup successful');
      return true;
      
    } catch (error) {
      console.error('💥 [SIGNUP] Unexpected error:', error);
      return false;
    }
  }
};
