import { supabase } from '@/integrations/supabase/client';
import { SignupFormData, LoginFormData } from '@/types/auth';

export const authService = {
  async signup(data: SignupFormData): Promise<boolean> {
    try {
      console.log('🔐 [AUTH_SERVICE] Attempting signup for:', data.email);
      
      const { data: authData, error } = await supabase.auth.signUp({
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

      if (error) {
        console.error('❌ [AUTH_SERVICE] Signup error:', error);
        throw new Error(error.message);
      }

      console.log('✅ [AUTH_SERVICE] Signup successful for user:', authData.user?.id);
      return true;
    } catch (error) {
      console.error('💥 [AUTH_SERVICE] Signup failed:', error);
      throw error;
    }
  },

  async login(data: LoginFormData & { rememberMe?: boolean }): Promise<{ success: boolean }> {
    try {
      console.log('🔐 [AUTH_SERVICE] Attempting login for:', data.email);
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('❌ [AUTH_SERVICE] Login error:', error);
        return { success: false };
      }

      if (!authData.session) {
        console.error('❌ [AUTH_SERVICE] No session returned');
        return { success: false };
      }

      console.log('✅ [AUTH_SERVICE] Login successful:', authData.user?.id);
      console.log('🔑 [AUTH_SERVICE] Session created:', !!authData.session);
      
      return { success: true };
    } catch (error) {
      console.error('💥 [AUTH_SERVICE] Login failed:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      console.log('👋 [AUTH_SERVICE] Début de la déconnexion...');
      
      // Effacer le localStorage avant la déconnexion
      console.log('🧹 [AUTH_SERVICE] Nettoyage du localStorage...');
      localStorage.clear();
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ [AUTH_SERVICE] Logout error:', error);
        throw new Error(error.message);
      }
      
      console.log('✅ [AUTH_SERVICE] Déconnexion réussie');
    } catch (error) {
      console.error('💥 [AUTH_SERVICE] Logout failed:', error);
      throw error;
    }
  }
};
