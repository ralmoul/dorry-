
import { supabase } from '@/integrations/supabase/client';
import { User, SignupFormData, LoginFormData } from '@/types/auth';

export const authService = {
  async login(data: LoginFormData & { rememberMe?: boolean }): Promise<{ success: boolean; user?: User }> {
    try {
      console.log('🔐 [LOGIN] Starting login for:', data.email);
      
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      if (authError) {
        console.error('❌ [LOGIN] Auth error:', authError.message);
        return { success: false };
      }

      if (!authData.user) {
        console.error('❌ [LOGIN] No user returned');
        return { success: false };
      }

      console.log('✅ [LOGIN] Login successful:', authData.user.id);
      return { success: true };
      
    } catch (error) {
      console.error('💥 [LOGIN] Unexpected error:', error);
      return { success: false };
    }
  },

  async signup(data: SignupFormData): Promise<boolean> {
    try {
      console.log('📝 [SIGNUP] Starting signup for:', data.email);
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
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

      if (authError) {
        console.error('❌ [SIGNUP] Auth error:', authError.message);
        return false;
      }

      if (!authData.user) {
        console.error('❌ [SIGNUP] No user returned');
        return false;
      }

      console.log('✅ [SIGNUP] Signup successful:', authData.user.id);
      return true;
      
    } catch (error) {
      console.error('💥 [SIGNUP] Unexpected error:', error);
      return false;
    }
  }
};
