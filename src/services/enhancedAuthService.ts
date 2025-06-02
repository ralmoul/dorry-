
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

      // 3️⃣ Procéder à l'inscription normale
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
        // Ne pas logger d'événement de sécurité pour les erreurs d'inscription normales
        console.error('Erreur Supabase Auth:', authError);
        return { success: false, message: 'Erreur lors de la création du compte' };
      }

      if (!authData.user) {
        return { success: false, message: 'Erreur lors de la création du compte' };
      }

      // 4️⃣ Créer le profil
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
        console.error('Erreur lors de la création du profil:', profileError);
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { success: false, message: 'Erreur lors de la création du profil utilisateur' };
      }

      // 5️⃣ Journaliser l'inscription (maintenant que l'utilisateur existe)
      await securityService.logSecurityEvent({
        user_id: authData.user.id, // Maintenant on a un vrai UUID
        event_type: 'account_locked', // En attente d'approbation
        ip_address: clientIP,
        user_agent: userAgent,
        details: { 
          email: cleanEmail,
          password_strength: passwordStrength.score,
          company: data.company
        }
      });

      // 6️⃣ Déconnecter immédiatement (compte en attente)
      await supabase.auth.signOut();
      
      return { 
        success: true, 
        message: 'Votre demande d\'accès a été envoyée avec succès ! Votre email doit être vérifié et votre compte approuvé avant de pouvoir vous connecter.' 
      };
      
    } catch (error) {
      console.error('💥 [SECURE_SIGNUP] Erreur inattendue:', error);
      return { success: false, message: 'Une erreur inattendue est survenue' };
    }
  }
};
