
import { supabase } from '@/integrations/supabase/client';
import { User, SignupFormData, LoginFormData } from '@/types/auth';

export const authService = {
  async login(data: LoginFormData & { rememberMe?: boolean }): Promise<{ success: boolean; user?: User }> {
    try {
      console.log('🔐 [LOGIN] Starting login process for:', data.email);
      
      // Validate input
      if (!data.email || !data.password) {
        console.error('❌ [LOGIN] Missing email or password');
        return { success: false };
      }

      const cleanEmail = data.email.toLowerCase().trim();
      console.log('🔍 [LOGIN] Searching for user with email:', cleanEmail);
      
      // Query users table directly (no RLS now)
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .limit(1);
      
      console.log('📊 [LOGIN] Query result:', { 
        users: users?.length || 0, 
        error: error?.message || 'none',
        errorCode: error?.code || 'none'
      });
      
      if (error) {
        console.error('❌ [LOGIN] Database error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        return { success: false };
      }
      
      if (!users || users.length === 0) {
        console.log('❌ [LOGIN] No user found with email:', cleanEmail);
        return { success: false };
      }
      
      const dbUser = users[0];
      console.log('✅ [LOGIN] User found:', { 
        id: dbUser.id, 
        email: dbUser.email, 
        approved: dbUser.is_approved,
        firstName: dbUser.first_name
      });
      
      // Check if user is approved
      if (!dbUser.is_approved) {
        console.log('❌ [LOGIN] User not approved yet');
        return { success: false };
      }
      
      // Check password
      if (data.password !== dbUser.password_hash) {
        console.log('❌ [LOGIN] Invalid password');
        return { success: false };
      }
      
      console.log('🎉 [LOGIN] Authentication successful!');
      
      // Create user object
      const user: User = {
        id: dbUser.id,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        email: dbUser.email,
        phone: dbUser.phone,
        company: dbUser.company,
        isApproved: dbUser.is_approved,
        createdAt: dbUser.created_at,
      };
      
      console.log('✅ [LOGIN] Login process completed successfully');
      return { success: true, user };
      
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
      console.log('🔍 [SIGNUP] Checking if email exists:', cleanEmail);
      
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', cleanEmail)
        .limit(1);
      
      console.log('📊 [SIGNUP] Email check result:', { 
        existing: existingUsers?.length || 0, 
        error: checkError?.message || 'none' 
      });
      
      if (checkError) {
        console.error('❌ [SIGNUP] Error checking existing email:', checkError);
        return false;
      }
      
      if (existingUsers && existingUsers.length > 0) {
        console.error('❌ [SIGNUP] Email already exists');
        return false;
      }
      
      console.log('✅ [SIGNUP] Email available, creating user...');
      
      // Create new user
      const newUserData = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: cleanEmail,
        phone: data.phone.trim(),
        company: data.company.trim(),
        password_hash: data.password, // Plain text for now
        is_approved: false
      };
      
      console.log('📝 [SIGNUP] Inserting user data:', { 
        ...newUserData, 
        password_hash: '[HIDDEN]' 
      });
      
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([newUserData])
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ [SIGNUP] Insert error:', {
          message: insertError.message,
          code: insertError.code,
          details: insertError.details
        });
        return false;
      }
      
      console.log('🎉 [SIGNUP] User created successfully:', { 
        id: newUser.id, 
        email: newUser.email 
      });
      
      return true;
      
    } catch (error) {
      console.error('💥 [SIGNUP] Unexpected error:', error);
      return false;
    }
  }
};
