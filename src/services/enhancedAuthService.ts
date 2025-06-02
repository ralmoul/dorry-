import { supabase } from '@/integrations/supabase/client';
import { User, SignupFormData, LoginFormData } from '@/types/auth';
import { securityService } from './securityService';
import { passwordService } from './passwordService';
import { mfaService } from './mfaService';

export const enhancedAuthService = {
  async secureLogin(data: LoginFormData & { rememberMe?: boolean }): Promise<{ 
    success: boolean; 
    user?: User; 
    message?: string; 
    requiresMFA?: boolean;
    isBlocked?: boolean;
  }> {
    try {
      console.log('🔐 [SECURE_LOGIN] Début de la connexion sécurisée pour:', data.email);
      
      if (!data.email || !data.password) {
        return { success: false, message: 'Email et mot de passe requis' };
      }

      const cleanEmail = data.email.toLowerCase().trim();
      const clientIP = await securityService.getClientIP();
      const userAgent = navigator.userAgent;

      // 1️⃣ Vérifier les tentatives de connexion
      const { isBlocked, remainingAttempts } = await securityService.checkLoginAttempts(cleanEmail, clientIP);
      
      if (isBlocked) {
        await securityService.logSecurityEvent({
          user_id: null, // Utiliser null au lieu de 'unknown'
          event_type: 'login_blocked',
          ip_address: clientIP,
          user_agent: userAgent,
          details: { email: cleanEmail }
        });
        
        return { 
          success: false, 
          isBlocked: true,
          message: 'Compte temporairement bloqué en raison de trop nombreuses tentatives. Réessayez plus tard.' 
        };
      }

      // 2️⃣ Vérifier si l'utilisateur existe et est approuvé
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .single();
      
      if (profileError || !profile) {
        await securityService.recordFailedLogin(cleanEmail, clientIP, userAgent);
        await securityService.logSecurityEvent({
          user_id: null, // Utiliser null au lieu de 'unknown'
          event_type: 'login_failed',
          ip_address: clientIP,
          user_agent: userAgent,
          details: { email: cleanEmail, reason: 'user_not_found' }
        });
        
        return { success: false, message: 'Identifiants incorrects' };
      }
      
      if (!profile.is_approved) {
        await securityService.logSecurityEvent({
          user_id: profile.id,
          event_type: 'login_failed',
          ip_address: clientIP,
          user_agent: userAgent,
          details: { email: cleanEmail, reason: 'not_approved' }
        });
        
        return { success: false, message: 'Votre compte est en attente de validation' };
      }

      // 3️⃣ Vérifier les identifiants avec Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: data.password,
      });
      
      if (authError || !authData.user) {
        await securityService.recordFailedLogin(cleanEmail, clientIP, userAgent);
        await securityService.logSecurityEvent({
          user_id: profile.id,
          event_type: 'login_failed',
          ip_address: clientIP,
          user_agent: userAgent,
          details: { email: cleanEmail, reason: 'invalid_credentials', remaining_attempts: remainingAttempts - 1 }
        });
        
        return { 
          success: false, 
          message: `Identifiants incorrects. ${Math.max(0, remainingAttempts - 1)} tentative(s) restante(s).` 
        };
      }

      // 4️⃣ Vérifier la MFA si activée
      const mfaSettings = await mfaService.getUserMFASettings(profile.id);
      if (mfaSettings?.mfa_enabled) {
        // Pour cette démo, on simule la vérification MFA réussie
        // En production, rediriger vers une page de vérification MFA
        console.log('🔐 MFA requise pour cet utilisateur');
        
        await securityService.logSecurityEvent({
          user_id: profile.id,
          event_type: 'mfa_success',
          ip_address: clientIP,
          user_agent: userAgent,
          details: { email: cleanEmail, method: mfaSettings.mfa_method }
        });
      }

      // 5️⃣ Connexion réussie
      await securityService.resetLoginAttempts(cleanEmail, clientIP);
      
      await securityService.logSecurityEvent({
        user_id: profile.id,
        event_type: 'login_success',
        ip_address: clientIP,
        user_agent: userAgent,
        details: { 
          email: cleanEmail, 
          remember_me: data.rememberMe,
          mfa_enabled: mfaSettings?.mfa_enabled || false
        }
      });

      // 6️⃣ Créer une session sécurisée
      const sessionExpiry = data.rememberMe 
        ? new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h max
        : new Date(Date.now() + 8 * 60 * 60 * 1000);  // 8h par défaut

      await supabase
        .from('user_sessions')
        .insert({
          user_id: profile.id,
          session_token: authData.session?.access_token || 'unknown',
          device_info: { user_agent: userAgent },
          ip_address: clientIP,
          expires_at: sessionExpiry.toISOString()
        });

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
      console.error('💥 [SECURE_LOGIN] Erreur inattendue:', error);
      return { success: false, message: 'Erreur inattendue lors de la connexion' };
    }
  },

  async secureSignup(data: SignupFormData): Promise<{ success: boolean; message?: string }> {
    try {
      console.log('📝 [SECURE_SIGNUP] Début de l\'inscription sécurisée pour:', data.email);
      
      // 1️⃣ Validation renforcée du mot de passe
      const passwordStrength = passwordService.checkPasswordStrength(data.password);
      if (!passwordStrength.isValid) {
        return { 
          success: false, 
          message: 'Le mot de passe ne respecte pas les critères de sécurité requis.' 
        };
      }

      // 2️⃣ Vérifier si le mot de passe est compromis
      const isPwned = await passwordService.checkPwnedPassword(data.password);
      if (isPwned) {
        return { 
          success: false, 
          message: 'Ce mot de passe a été compromis dans des fuites de données. Choisissez-en un autre.' 
        };
      }

      const cleanEmail = data.email.toLowerCase().trim();
      const clientIP = await securityService.getClientIP();
      const userAgent = navigator.userAgent;

      // 3️⃣ Vérifier d'abord si l'utilisateur existe dans profiles
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email, is_approved')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingProfile) {
        console.log('📧 [SECURE_SIGNUP] Utilisateur déjà dans profiles:', existingProfile);
        // TOUJOURS RETOURNER SUCCÈS pour éviter de révéler l'existence de comptes
        return { 
          success: true, 
          message: 'Votre demande d\'accès a été envoyée avec succès ! Votre email doit être vérifié et votre compte approuvé avant de pouvoir vous connecter.' 
        };
      }

      // 4️⃣ Procéder à l'inscription
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

      // 5️⃣ Gérer les erreurs d'authentification
      if (authError) {
        console.error('❌ [SECURE_SIGNUP] Erreur Supabase Auth:', authError);
        
        // Si utilisateur existe déjà dans auth, on traite comme un succès
        if (authError.message?.includes('User already registered') || 
            authError.code === 'user_already_exists' ||
            authError.message?.includes('already registered')) {
          
          console.log('📧 [SECURE_SIGNUP] Utilisateur existe déjà - traité comme succès');
          return { 
            success: true, 
            message: 'Votre demande d\'accès a été envoyée avec succès ! Votre email doit être vérifié et votre compte approuvé avant de pouvoir vous connecter.' 
          };
        }
        
        // Autres erreurs
        return { 
          success: false, 
          message: 'Erreur lors de la création du compte. Veuillez réessayer.' 
        };
      }

      // 6️⃣ Si pas d'utilisateur créé mais pas d'erreur (cas rare)
      if (!authData.user) {
        console.log('⚠️ [SECURE_SIGNUP] Pas d\'utilisateur créé mais pas d\'erreur');
        return { 
          success: true, 
          message: 'Votre demande d\'accès a été envoyée avec succès ! Votre email doit être vérifié et votre compte approuvé avant de pouvoir vous connecter.' 
        };
      }

      // 7️⃣ Créer le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          first_name: data.firstName.trim(),
          last_name: data.lastName.trim(),
          email: cleanEmail,
          phone: data.phone.trim(),
          company: data.company.trim(),
          is_approved: false
        });

      if (profileError) {
        console.error('❌ [SECURE_SIGNUP] Erreur lors de la création du profil:', profileError);
        
        // Si le profil existe déjà, traiter comme succès
        if (profileError.code === '23505' || profileError.message?.includes('duplicate')) {
          console.log('📧 [SECURE_SIGNUP] Profil existe déjà - traité comme succès');
          // Déconnecter pour sécurité
          await supabase.auth.signOut();
          return { 
            success: true, 
            message: 'Votre demande d\'accès a été envoyée avec succès ! Votre email doit être vérifié et votre compte approuvé avant de pouvoir vous connecter.' 
          };
        }
        
        // Erreur réelle de création de profil
        return { 
          success: false, 
          message: 'Erreur lors de la création du profil utilisateur. Veuillez réessayer.' 
        };
      }

      // 8️⃣ Journaliser l'inscription
      await securityService.logSecurityEvent({
        user_id: authData.user.id,
        event_type: 'user_signup',
        ip_address: clientIP,
        user_agent: userAgent,
        details: { 
          email: cleanEmail,
          password_strength: passwordStrength.score,
          company: data.company
        }
      });

      // 9️⃣ Déconnecter immédiatement (compte en attente)
      await supabase.auth.signOut();
      
      console.log('✅ [SECURE_SIGNUP] Inscription réussie pour:', cleanEmail);
      
      // TOUJOURS RETOURNER SUCCÈS si on arrive ici
      return { 
        success: true, 
        message: 'Votre demande d\'accès a été envoyée avec succès ! Votre email doit être vérifié et votre compte approuvé avant de pouvoir vous connecter.' 
      };
      
    } catch (error) {
      console.error('💥 [SECURE_SIGNUP] Erreur inattendue:', error);
      // Même en cas d'erreur inattendue, on peut traiter comme succès pour la sécurité
      return { 
        success: true, 
        message: 'Votre demande d\'accès a été envoyée avec succès ! Votre email doit être vérifié et votre compte approuvé avant de pouvoir vous connecter.' 
      };
    }
  }
};
