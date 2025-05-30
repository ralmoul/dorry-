
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

      console.log('✅ [AUTH_SERVICE] Signup successful:', authData.user?.id);
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
        throw new Error(error.message);
      }

      console.log('✅ [AUTH_SERVICE] Login successful:', authData.user?.id);
      return { success: true };
    } catch (error) {
      console.error('💥 [AUTH_SERVICE] Login failed:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      console.log('👋 [AUTH_SERVICE] Logging out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ [AUTH_SERVICE] Logout error:', error);
        throw new Error(error.message);
      }
      
      console.log('✅ [AUTH_SERVICE] Logout successful');
    } catch (error) {
      console.error('💥 [AUTH_SERVICE] Logout failed:', error);
      throw error;
    }
  }
};
