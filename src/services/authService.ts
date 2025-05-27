
import { supabase } from '@/integrations/supabase/client';
import { User, SignupFormData, LoginFormData } from '@/types/auth';

export const authService = {
  async login(data: LoginFormData & { rememberMe?: boolean }): Promise<{ success: boolean; user?: User }> {
    try {
      console.log('🔐 [LOGIN] Starting Supabase auth login for:', data.email);
      
      // Use Supabase auth for login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email.toLowerCase().trim(),
        password: data.password,
      });

      if (authError) {
        console.error('❌ [LOGIN] Supabase auth error:', authError.message);
        return { success: false };
      }

      if (!authData.user) {
        console.error('❌ [LOGIN] No user returned from Supabase auth');
        return { success: false };
      }

      console.log('✅ [LOGIN] Supabase auth successful for user:', authData.user.id);

      // The AuthProvider will handle checking the user profile and approval status
      // via the onAuthStateChange listener, so we just return success here
      return { success: true };
      
    } catch (error) {
      console.error('💥 [LOGIN] Unexpected error:', error);
      return { success: false };
    }
  },

  async signup(data: SignupFormData): Promise<boolean> {
    try {
      console.log('📝 [SIGNUP] Starting signup process for:', data.email);
      
      // Validate all required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'company', 'password'];
      const missingFields = requiredFields.filter(field => !data[field as keyof SignupFormData]?.trim());
      
      if (missingFields.length > 0) {
        console.error('❌ [SIGNUP] Missing required fields:', missingFields);
        return false;
      }
      
      const cleanEmail = data.email.toLowerCase().trim();
      
      // First create Supabase auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cleanEmail,
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
        console.error('❌ [SIGNUP] Supabase auth error:', authError.message);
        return false;
      }

      if (!authData.user) {
        console.error('❌ [SIGNUP] No user returned from Supabase auth');
        return false;
      }

      console.log('✅ [SIGNUP] Supabase auth user created:', authData.user.id);

      // Now add to our custom users table
      const newUserData = {
        id: authData.user.id, // Use the Supabase auth user ID
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: cleanEmail,
        phone: data.phone.trim(),
        company: data.company.trim(),
        password_hash: 'supabase_managed', // Placeholder since Supabase manages passwords
        is_approved: false
      };
      
      const { error: insertError } = await supabase
        .from('users')
        .insert([newUserData]);
      
      if (insertError) {
        console.error('❌ [SIGNUP] Insert error:', insertError.message);
        // If the profile creation fails, we still consider signup successful
        // since the auth user was created
        console.log('⚠️ [SIGNUP] Auth user created but profile creation failed');
      } else {
        console.log('✅ [SIGNUP] User profile created successfully');
      }
      
      // Sign out the user since they need approval
      await supabase.auth.signOut();
      
      return true;
      
    } catch (error) {
      console.error('💥 [SIGNUP] Unexpected error:', error);
      return false;
    }
  }
};
