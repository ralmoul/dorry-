
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
      
      // 1️⃣ - Vérifier si l'utilisateur existe dans la table profiles
      console.log('🔍 [LOGIN] Checking if user exists in profiles table');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .single();
      
      // Cas 3️⃣ : Aucune demande de création de compte
      if (profileError || !profile) {
        console.log('❌ [LOGIN] No account request found for this email');
        return { success: false, message: 'Aucune demande de création de compte n\'a été faite avec cette adresse email.' };
      }
      
      // Cas 2️⃣ : Compte en attente de validation
      if (!profile.is_approved) {
        console.log('❌ [LOGIN] Account pending approval');
        return { success: false, message: 'Votre compte est en attente de validation, veuillez patienter.' };
      }
      
      console.log('✅ [LOGIN] User exists and is approved, attempting Supabase auth...');
      
      // 2️⃣ - Tenter l'authentification Supabase
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: data.password,
      });
      
      // Cas 1️⃣ : Email ou mot de passe invalide
      if (authError || !authData.user) {
        console.error('❌ [LOGIN] Invalid credentials:', authError?.message);
        return { success: false, message: 'Adresse email ou mot de passe incorrect.' };
      }
      
      console.log('✅ [LOGIN] Authentication successful');
      
      // 3️⃣ - Vérification de sécurité : s'assurer que l'ID correspond
      if (authData.user.id !== profile.id) {
        console.error('❌ [LOGIN] SECURITY BREACH - User ID mismatch, signing out');
        await supabase.auth.signOut();
        return { success: false, message: 'Erreur de sécurité.' };
      }
      
      // 4️⃣ - Créer l'objet utilisateur final
      const user: User = {
        id: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        email: profile.email,
        phone: profile.phone,
        company: profile.company,
        isApproved: profile.is_approved,
        createdAt: profile.created_at,
      };
      
      return { success: true, user };
      
    } catch (error) {
      console.error('💥 [LOGIN] Unexpected error:', error);
      return { success: false, message: 'Erreur inattendue lors de la connexion.' };
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
      console.log('🔍 [SIGNUP] Checking if email exists in profiles table:', cleanEmail);
      
      // 1️⃣ - Vérifier d'abord dans la table profiles
      const { data: existingProfiles, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, email, is_approved')
        .eq('email', cleanEmail)
        .limit(1);
      
      if (profileCheckError) {
        console.error('❌ [SIGNUP] Error checking existing email in profiles:', profileCheckError);
        return { success: false, message: 'Erreur lors de la vérification de l\'email' };
      }
      
      if (existingProfiles && existingProfiles.length > 0) {
        console.log('❌ [SIGNUP] Email already exists in profiles table');
        const existingProfile = existingProfiles[0];
        
        if (!existingProfile.is_approved) {
          return { 
            success: false, 
            message: 'Une demande de création de compte a déjà été faite avec cette adresse email et est en attente de validation. Veuillez patienter.' 
          };
        } else {
          return { 
            success: false, 
            message: 'Une demande de création de compte a déjà été faite avec cette adresse email.' 
          };
        }
      }
      
      console.log('🔍 [SIGNUP] Email not found in profiles, checking auth.users via signup attempt...');
      
      // 2️⃣ - Tenter la création via Supabase Auth pour détecter les conflits
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
      
      // 🧹 CAS SPÉCIAL : Email existe dans auth.users mais pas dans profiles (utilisateur orphelin)
      if (authError && authError.message.includes('User already registered')) {
        console.log('🧹 [SIGNUP] NETTOYAGE - Email orphelin détecté dans auth.users, tentative de nettoyage...');
        
        // Essayer de récupérer l'utilisateur orphelin et le supprimer
        try {
          // Tenter une connexion temporaire pour récupérer l'ID de l'utilisateur orphelin
          const { data: tempAuthData } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: data.password,
          });
          
          if (tempAuthData.user) {
            console.log('🗑️ [SIGNUP] Suppression de l\'utilisateur orphelin:', tempAuthData.user.id);
            
            // Supprimer l'utilisateur orphelin de auth.users
            const { error: deleteError } = await supabase.auth.admin.deleteUser(tempAuthData.user.id);
            
            if (deleteError) {
              console.error('❌ [SIGNUP] Erreur lors de la suppression de l\'utilisateur orphelin:', deleteError);
            } else {
              console.log('✅ [SIGNUP] Utilisateur orphelin supprimé, retry signup...');
              
              // Déconnecter la session temporaire
              await supabase.auth.signOut();
              
              // Retry la création après nettoyage
              const { data: retryAuthData, error: retryAuthError } = await supabase.auth.signUp({
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
              
              if (retryAuthError || !retryAuthData.user) {
                console.error('❌ [SIGNUP] Retry failed après nettoyage:', retryAuthError);
                return { 
                  success: false, 
                  message: 'Erreur technique lors de la création du compte après nettoyage. Veuillez réessayer.' 
                };
              }
              
              // Continuer avec le nouveau compte créé
              const newAuthData = retryAuthData;
              console.log('✅ [SIGNUP] Compte recréé avec succès après nettoyage:', newAuthData.user.id);
              
              // 3️⃣ - Créer l'entrée dans profiles
              const profileData = {
                id: newAuthData.user.id,
                first_name: data.firstName.trim(),
                last_name: data.lastName.trim(),
                email: cleanEmail,
                phone: data.phone.trim(),
                company: data.company.trim(),
                is_approved: false
              };
              
              console.log('📝 [SIGNUP] Creating profile entry after cleanup:', profileData);
              
              const { data: profileResult, error: profileError } = await supabase
                .from('profiles')
                .insert(profileData)
                .select()
                .single();
              
              if (profileError) {
                console.error('❌ [SIGNUP] Profile creation error after cleanup:', profileError);
                
                // Si la création du profil échoue, supprimer l'utilisateur auth créé
                console.log('🔄 [SIGNUP] Cleaning up auth user due to profile creation failure');
                await supabase.auth.admin.deleteUser(newAuthData.user.id);
                
                return { 
                  success: false, 
                  message: 'Erreur lors de la création du profil utilisateur. Veuillez réessayer.' 
                };
              }
              
              console.log('✅ [SIGNUP] Profile created successfully after cleanup:', profileResult);
              
              // Déconnecter l'utilisateur immédiatement car il doit être approuvé
              await supabase.auth.signOut();
              
              console.log('🎉 [SIGNUP] Signup complete after cleanup - user pending approval');
              
              return { 
                success: true, 
                message: 'Votre compte a été créé avec succès ! Il sera activé après validation par notre équipe. Vous recevrez un email de confirmation.' 
              };
            }
          }
        } catch (cleanupError) {
          console.error('💥 [SIGNUP] Erreur lors du nettoyage:', cleanupError);
        }
        
        // Si le nettoyage échoue, retourner le message d'erreur original
        return { 
          success: false, 
          message: 'Cette adresse email est déjà utilisée. Si vous avez un compte, veuillez vous connecter. Sinon, contactez le support.' 
        };
      }
      
      if (authError) {
        console.error('❌ [SIGNUP] Auth signup error:', authError);
        return { 
          success: false, 
          message: 'Erreur lors de la création du compte : ' + authError.message 
        };
      }
      
      if (!authData.user) {
        console.error('❌ [SIGNUP] No user returned from auth signup');
        return { 
          success: false, 
          message: 'Erreur lors de la création du compte. Aucun utilisateur créé.' 
        };
      }
      
      console.log('✅ [SIGNUP] Auth user created successfully:', authData.user.id);
      
      // 3️⃣ - Créer l'entrée dans profiles
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
        
        // Si la création du profil échoue, supprimer l'utilisateur auth créé
        console.log('🔄 [SIGNUP] Cleaning up auth user due to profile creation failure');
        await supabase.auth.admin.deleteUser(authData.user.id);
        
        return { 
          success: false, 
          message: 'Erreur lors de la création du profil utilisateur. Veuillez réessayer.' 
        };
      }
      
      console.log('✅ [SIGNUP] Profile created successfully:', profileResult);
      
      // Déconnecter l'utilisateur immédiatement car il doit être approuvé
      await supabase.auth.signOut();
      
      console.log('🎉 [SIGNUP] Signup complete - user pending approval');
      
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
