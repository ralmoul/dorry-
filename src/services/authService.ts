import { supabase } from '@/integrations/supabase/client';
import { SignupFormData, LoginFormData } from '@/types/auth';

export const authService = {
  async signup(data: SignupFormData): Promise<boolean> {
    try {
      console.log('🔐 [AUTH_SERVICE] Attempting signup for:', data.email);
      console.log('🔐 [AUTH_SERVICE] Signup data being sent:', {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
        company: data.company
      });
      
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
      console.log('✅ [AUTH_SERVICE] User metadata:', authData.user?.user_metadata);
      
      // Vérifier si le profil a été créé
      if (authData.user?.id) {
        console.log('🔍 [AUTH_SERVICE] Checking if profile was created...');
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        
        if (profile) {
          console.log('✅ [AUTH_SERVICE] Profile created successfully:', profile);
        } else {
          console.error('❌ [AUTH_SERVICE] Profile not found after signup:', profileError);
        }
      }
      
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
