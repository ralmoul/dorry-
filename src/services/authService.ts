
import { supabase } from '@/integrations/supabase/client';
import { SignupFormData, LoginFormData } from '@/types/auth';

export const authService = {
  async login(data: LoginFormData & { rememberMe?: boolean }): Promise<boolean> {
    try {
      console.log('🔐 [LOGIN] Starting login for:', data.email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      if (error) {
        console.error('❌ [LOGIN] Auth error:', error.message);
        return false;
      }

      console.log('✅ [LOGIN] Login successful');
      return true;
      
    } catch (error) {
      console.error('💥 [LOGIN] Unexpected error:', error);
      return false;
    }
  },

  async signup(data: SignupFormData): Promise<boolean> {
    try {
      console.log('📝 [SIGNUP] Starting signup for:', data.email);
      
      const { error } = await supabase.auth.signUp({
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
        console.error('❌ [SIGNUP] Auth error:', error.message);
        return false;
      }

      console.log('✅ [SIGNUP] Signup successful');
      return true;
      
    } catch (error) {
      console.error('💥 [SIGNUP] Unexpected error:', error);
      return false;
    }
  }
};
