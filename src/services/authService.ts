
import { supabase } from '@/integrations/supabase/client';
import { User, SignupFormData, LoginFormData, DatabaseProfile } from '@/types/auth';

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
      
      // Query profiles table
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
      
      const dbUser: DatabaseProfile = users[0];
      console.log('✅ [LOGIN] User found:', { 
        id: dbUser.id, 
        email: dbUser.email, 
        isApproved: dbUser.is_approved,
        firstName: dbUser.first_name
      });
      
      // CORRECTION CRITIQUE : Vérification stricte du statut d'approbation
      if (!dbUser.is_approved) {
        console.log('⏳ [LOGIN] User account not approved - ACCESS DENIED');
        return { 
          success: false, 
          message: 'Votre compte est en cours de validation par notre équipe. Vous recevrez un email dès que votre accès sera activé.' 
        };
      }
      
      // TODO: Ajouter une vraie vérification de mot de passe avec hachage
      // Pour l'instant, nous acceptons toute connexion pour les comptes approuvés
      console.log('⚠️ [LOGIN] Password verification skipped - implement proper hashing');
      
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
      
      return { success: true, user };
      
    } catch (error) {
      console.error('💥 [LOGIN] Unexpected error:', error);
      return { success: false, message: 'Une erreur inattendue est survenue' };
    }
  },

  async signup(data: SignupFormData): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('📝 [SIGNUP] Starting signup process for:', data.email);
      
      // CORRECTION : Validation stricte des champs requis
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'company', 'password'];
      const missingFields = requiredFields.filter(field => !data[field as keyof SignupFormData]?.trim());
      
      if (missingFields.length > 0) {
        console.error('❌ [SIGNUP] Missing required fields:', missingFields);
        return { success: false, message: 'Tous les champs sont obligatoires' };
      }
      
      const cleanEmail = data.email.toLowerCase().trim();
      console.log('🔍 [SIGNUP] Checking if email exists:', cleanEmail);
      
      // CORRECTION : Vérification d'email existant améliorée
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id, email, is_approved')
        .eq('email', cleanEmail)
        .limit(1);
      
      if (checkError) {
        console.error('❌ [SIGNUP] Error checking existing email:', checkError);
        return { success: false, message: 'Erreur lors de la vérification de l\'email' };
      }
      
      if (existingUsers && existingUsers.length > 0) {
        console.error('❌ [SIGNUP] Email already exists');
        const existingUser = existingUsers[0];
        
        if (!existingUser.is_approved) {
          return { 
            success: false, 
            message: 'Un compte avec cet email est déjà en cours de validation. Veuillez patienter.' 
          };
        } else {
          return { 
            success: false, 
            message: 'Un compte avec cet email existe déjà. Utilisez la fonction de connexion.' 
          };
        }
      }
      
      console.log('✅ [SIGNUP] Email available, creating user...');
      
      // Generate a new UUID for the user using crypto API
      const userId = crypto.randomUUID();
      
      // CORRECTION : Création avec statut "pending" obligatoire
      const newUserData = {
        id: userId,
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: cleanEmail,
        phone: data.phone.trim(),
        company: data.company.trim(),
        is_approved: false // CRITIQUE : Toujours "false" par défaut
      };
      
      console.log('📝 [SIGNUP] Inserting user data:', newUserData);
      
      const { data: newUser, error: insertError } = await supabase
        .from('profiles')
        .insert(newUserData)
        .select()
        .single();
      
      if (insertError) {
        console.error('❌ [SIGNUP] Insert error:', insertError);
        // CORRECTION : Logs détaillés pour debug
        console.error('❌ [SIGNUP] Insert error details:', {
          code: insertError.code,
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint
        });
        return { 
          success: false, 
          message: 'Erreur lors de la création du compte. Veuillez réessayer.' 
        };
      }
      
      if (!newUser) {
        console.error('❌ [SIGNUP] No user returned after insert');
        return { 
          success: false, 
          message: 'Erreur lors de la création du compte. Aucun utilisateur retourné.' 
        };
      }
      
      console.log('🎉 [SIGNUP] User created successfully:', { 
        id: newUser.id, 
        email: newUser.email,
        isApproved: newUser.is_approved
      });
      
      return { 
        success: true, 
        message: 'Votre compte a été créé avec succès ! Il sera activé après validation par notre équipe. Vous recevrez un email de confirmation.' 
      };
      
    } catch (error) {
      console.error('💥 [SIGNUP] Unexpected error:', error);
      // CORRECTION : Log détaillé de l'erreur pour debug
      console.error('💥 [SIGNUP] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      return { 
        success: false, 
        message: 'Une erreur inattendue est survenue lors de la création du compte' 
      };
    }
  }
};
