
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

      console.log('✅ [LOGIN] Supabase auth successful, fetching user profile...');

      // Get user profile from our custom users table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('email', data.email.toLowerCase().trim())
        .single();

      if (profileError || !userProfile) {
        console.error('❌ [LOGIN] Profile not found:', profileError?.message);
        await supabase.auth.signOut(); // Clean up auth session
        return { success: false };
      }

      if (!userProfile.is_approved) {
        console.log('❌ [LOGIN] User not approved yet');
        await supabase.auth.signOut(); // Clean up auth session
        return { success: false };
      }

      // Create user object
      const user: User = {
        id: userProfile.id,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        email: userProfile.email,
        phone: userProfile.phone,
        company: userProfile.company,
        isApproved: userProfile.is_approved,
        createdAt: userProfile.created_at,
      };
      
      console.log('🎉 [LOGIN] Login process completed successfully');
      return { success: true, user };
      
    } catch (error) {
      console.error('💥 [LOGIN] Unexpected error:', error);
      return { success: false };
    }
  },

  async signup(data: SignupFormData): Promise<boolean> {
    try {
      console.log('📝 [SIGNUP] Starting Supabase auth signup for:', data.email);
      
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

      console.log('✅ [SIGNUP] Supabase auth user created, adding to users table...');

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
        // Clean up auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id);
        return false;
      }
      
      console.log('🎉 [SIGNUP] User created successfully');
      
      // Sign out the user since they need approval
      await supabase.auth.signOut();
      
      return true;
      
    } catch (error) {
      console.error('💥 [SIGNUP] Unexpected error:', error);
      return false;
    }
  }
};
