
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
      console.log('🔐 [LOGIN] Attempting Supabase Auth login for:', cleanEmail);
      
      // 1️⃣ - Utiliser Supabase Auth pour vérifier email + mot de passe
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: data.password,
      });
      
      if (authError || !authData.user) {
        console.error('❌ [LOGIN] Supabase Auth error:', authError?.message);
        return { success: false, message: 'Email ou mot de passe incorrect' };
      }
      
      console.log('✅ [LOGIN] Supabase Auth successful for user:', authData.user.id);
      
      // 2️⃣ - Vérifier le profil et le statut d'approbation
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();
      
      if (profileError || !profileData) {
        console.error('❌ [LOGIN] Profile not found:', profileError?.message);
        // Déconnecter de Supabase Auth
        await supabase.auth.signOut();
        return { success: false, message: 'Profil utilisateur non trouvé' };
      }
      
      const dbUser: DatabaseProfile = profileData;
      console.log('📊 [LOGIN] Profile found:', { 
        id: dbUser.id, 
        email: dbUser.email, 
        isApproved: dbUser.is_approved,
        firstName: dbUser.first_name
      });
      
      // 3️⃣ - BLOCAGE STRICT - Vérification obligatoire du statut d'approbation
      if (!dbUser.is_approved) {
        console.log('❌ [LOGIN] BLOCKED - User account not approved');
        // Déconnecter de Supabase Auth
        await supabase.auth.signOut();
        return { 
          success: false, 
          message: 'Votre compte est en attente de validation par notre équipe. Merci de patienter.' 
        };
      }
      
      console.log('🎉 [LOGIN] Authentication successful for approved user!');
      
      // 4️⃣ - Créer l'objet utilisateur pour l'application
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
      
      // Validate all required fields
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'company', 'password'];
      const missingFields = requiredFields.filter(field => !data[field as keyof SignupFormData]?.trim());
      
      if (missingFields.length > 0) {
        console.error('❌ [SIGNUP] Missing required fields:', missingFields);
        return { success: false, message: 'Tous les champs sont obligatoires' };
      }
      
      const cleanEmail = data.email.toLowerCase().trim();
      console.log('🔍 [SIGNUP] Checking if email exists:', cleanEmail);
      
      // Check if email already exists in profiles
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
      
      console.log('✅ [SIGNUP] Email available, creating user via Supabase Auth...');
      
      // 1️⃣ - Create user via Supabase Auth first
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
        console.error('❌ [SIGNUP] Auth signup error:', authError);
        return { 
          success: false, 
          message: 'Erreur lors de la création du compte. Veuillez réessayer.' 
        };
      }
      
      if (!authData.user) {
        console.error('❌ [SIGNUP] No user returned from auth signup');
        return { 
          success: false, 
          message: 'Erreur lors de la création du compte. Veuillez réessayer.' 
        };
      }
      
      console.log('✅ [SIGNUP] Auth user created:', authData.user.id);
      
      // 2️⃣ - Create profile entry manually (in case trigger doesn't work)
      const profileData = {
        id: authData.user.id,
        first_name: data.firstName.trim(),
        last_name: data.lastName.trim(),
        email: cleanEmail,
        phone: data.phone.trim(),
        company: data.company.trim(),
        is_approved: false
      };
      
      console.log('📝 [SIGNUP] Creating profile entry:', profileData);
      
      const { data: profileResult, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();
      
      if (profileError) {
        console.error('❌ [SIGNUP] Profile creation error:', profileError);
        
        // If profile creation fails, we still consider signup successful
        // as the auth user was created and trigger might handle it
        console.log('⚠️ [SIGNUP] Profile creation failed, but auth user exists - trigger should handle it');
      } else {
        console.log('✅ [SIGNUP] Profile created successfully:', profileResult);
      }
      
      // Sign out the user immediately since they need approval
      await supabase.auth.signOut();
      
      console.log('🎉 [SIGNUP] User created - will appear in admin panel immediately');
      
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
