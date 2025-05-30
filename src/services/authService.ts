
import { supabase } from '@/integrations/supabase/client';
import { User, SignupFormData, LoginFormData } from '@/types/auth';

export const authService = {
  async login(data: LoginFormData & { rememberMe?: boolean }): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      console.log('🔐 [LOGIN] Starting login process for:', data.email);
      
      if (!data.email || !data.password) {
        console.error('❌ [LOGIN] Missing email or password');
        return { success: false, message: 'Email et mot de passe requis' };
      }

      const cleanEmail = data.email.toLowerCase().trim();
      console.log('🔍 [LOGIN] Searching for user with email:', cleanEmail);
      
      // Query profiles table with new status field
      const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .limit(1);
      
      console.log('📊 [LOGIN] Query result:', { 
        users: users?.length || 0, 
        error: error?.message || 'none',
      });
      
      if (error) {
        console.error('❌ [LOGIN] Database error:', error);
        return { success: false, message: 'Erreur de connexion à la base de données' };
      }
      
      if (!users || users.length === 0) {
        console.log('❌ [LOGIN] No user found with email:', cleanEmail);
        return { success: false, message: 'Email ou mot de passe incorrect' };
      }
      
      const dbUser = users[0];
      console.log('✅ [LOGIN] User found:', { 
        id: dbUser.id, 
        email: dbUser.email, 
        status: dbUser.status,
        firstName: dbUser.first_name
      });
      
      // Check user status first
      if (dbUser.status === 'pending') {
        console.log('⏳ [LOGIN] User account pending approval');
        return { 
          success: false, 
          message: 'Votre compte est en cours de validation par notre équipe. Vous recevrez un email dès que votre accès sera activé.' 
        };
      }
      
      if (dbUser.status === 'rejected') {
        console.log('❌ [LOGIN] User account rejected');
        return { 
          success: false, 
          message: 'Votre demande de compte a été refusée. Contactez l\'administrateur pour plus d\'informations.' 
        };
      }
      
      if (dbUser.status !== 'approved') {
        console.log('❌ [LOGIN] Invalid user status:', dbUser.status);
        return { 
          success: false, 
          message: 'Statut de compte invalide. Contactez l\'administrateur.' 
        };
      }
      
      // Check password (we'll use the existing password_hash field for now)
      if (data.password !== dbUser.password_hash) {
        console.log('❌ [LOGIN] Invalid password');
        return { success: false, message: 'Email ou mot de passe incorrect' };
      }
      
      console.log('🎉 [LOGIN] Authentication successful!');
      
      // Create user object with new fields
      const user: User = {
        id: dbUser.id,
        firstName: dbUser.first_name,
        lastName: dbUser.last_name,
        email: dbUser.email,
        phone: dbUser.phone,
        company: dbUser.company,
        isApproved: dbUser.status === 'approved',
        createdAt: dbUser.created_at,
      };
      
      return { success: true, user };
      
    } catch (error) {
      console.error('💥 [LOGIN] Unexpected error:', error);
      return { success: false, message: 'Une erreur inattendue est survenue' };
    }
  },

  async signup(data: SignupFormData): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('📝 [SIGNUP] Starting signup process for:', data.email);
      
      // Validate all required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'company', 'password'];
      const missingFields = requiredFields.filter(field => !data[field as keyof SignupFormData]?.trim());
      
      if (missingFields.length > 0) {
        console.error('❌ [SIGNUP] Missing required fields:', missingFields);
        return { success: false, message: 'Tous les champs sont obligatoires' };
      }
      
      const cleanEmail = data.email.toLowerCase().trim();
      console.log('🔍 [SIGNUP] Checking if email exists:', cleanEmail);
      
      // Check if email already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id, email, status')
        .eq('email', cleanEmail)
        .limit(1);
      
      if (checkError) {
        console.error('❌ [SIGNUP] Error checking existing email:', checkError);
        return { success: false, message: 'Erreur lors de la vérification de l\'email' };
      }
      
      if (existingUsers && existingUsers.length > 0) {
        console.error('❌ [SIGNUP] Email already exists');
        const existingUser = existingUsers[0];
        
        if (existingUser.status === 'pending') {
          return { 
            success: false, 
            message: 'Un compte avec cet email est déjà en cours de validation. Veuillez patienter.' 
          };
        } else if (existingUser.status === 'approved') {
          return { 
            success: false, 
            message: 'Un compte avec cet email existe déjà. Utilisez la fonction de connexion.' 
          };
        } else {
          return { 
            success: false, 
            message: 'Un compte avec cet email existe déjà.' 
          };
        }
      }
      
      console.log('✅ [SIGNUP] Email available, creating user...');
      
      // Create new user with pending status by default
      const newUserData = {
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: cleanEmail,
        phone: data.phone.trim(),
        company: data.company.trim(),
        password_hash: data.password, // Plain text for now (should be hashed in production)
        status: 'pending' // Default status
      };
      
      const { data: newUser, error: insertError } = await supabase
        .from('profiles')
        .insert([newUserData])
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ [SIGNUP] Insert error:', insertError);
        return { 
          success: false, 
          message: 'Erreur lors de la création du compte. Veuillez réessayer.' 
        };
      }
      
      console.log('🎉 [SIGNUP] User created successfully:', { 
        id: newUser.id, 
        email: newUser.email,
        status: newUser.status
      });
      
      return { 
        success: true, 
        message: 'Votre compte a été créé avec succès ! Il sera activé après validation par notre équipe. Vous recevrez un email de confirmation.' 
      };
      
    } catch (error) {
      console.error('💥 [SIGNUP] Unexpected error:', error);
      return { 
        success: false, 
        message: 'Une erreur inattendue est survenue lors de la création du compte' 
      };
    }
  }
};
