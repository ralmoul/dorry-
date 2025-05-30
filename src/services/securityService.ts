
import { supabase } from '@/integrations/supabase/client';

export interface SecurityAuditLog {
  id?: string;
  user_id: string;
  event_type: string;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, any>;
  created_at?: string;
}

export interface LoginAttempt {
  email: string;
  ip_address: string;
  user_agent?: string;
  failed_attempts: number;
  blocked_until?: string;
}

export const securityService = {
  // Journalisation des événements de sécurité
  async logSecurityEvent(event: Omit<SecurityAuditLog, 'id' | 'created_at'>) {
    try {
      const { error } = await supabase
        .from('security_audit_logs')
        .insert(event);
      
      if (error) {
        console.error('Erreur lors de la journalisation:', error);
      }
    } catch (error) {
      console.error('Erreur lors de la journalisation:', error);
    }
  },

  // Vérifier les tentatives de connexion
  async checkLoginAttempts(email: string, ipAddress: string): Promise<{ isBlocked: boolean; remainingAttempts: number }> {
    try {
      const { data, error } = await supabase
        .from('login_attempts')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('ip_address', ipAddress)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la vérification des tentatives:', error);
        return { isBlocked: false, remainingAttempts: 5 };
      }

      if (!data) {
        return { isBlocked: false, remainingAttempts: 5 };
      }

      // Vérifier si le compte est bloqué
      if (data.blocked_until && new Date(data.blocked_until) > new Date()) {
        return { isBlocked: true, remainingAttempts: 0 };
      }

      const remainingAttempts = Math.max(0, 5 - data.failed_attempts);
      return { isBlocked: false, remainingAttempts };
    } catch (error) {
      console.error('Erreur lors de la vérification des tentatives:', error);
      return { isBlocked: false, remainingAttempts: 5 };
    }
  },

  // Enregistrer une tentative de connexion échouée
  async recordFailedLogin(email: string, ipAddress: string, userAgent?: string) {
    try {
      const { data: existing } = await supabase
        .from('login_attempts')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('ip_address', ipAddress)
        .maybeSingle();

      if (existing) {
        const newFailedAttempts = existing.failed_attempts + 1;
        let blockedUntil = null;

        // Calcul du délai de blocage progressif
        if (newFailedAttempts >= 5) {
          const blockDuration = Math.min(Math.pow(2, newFailedAttempts - 5) * 5, 60); // Max 60 minutes
          blockedUntil = new Date(Date.now() + blockDuration * 60 * 1000).toISOString();
        }

        await supabase
          .from('login_attempts')
          .update({
            failed_attempts: newFailedAttempts,
            blocked_until: blockedUntil,
            last_attempt_at: new Date().toISOString(),
            user_agent: userAgent
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('login_attempts')
          .insert({
            email: email.toLowerCase(),
            ip_address: ipAddress,
            user_agent: userAgent,
            failed_attempts: 1,
            last_attempt_at: new Date().toISOString()
          });
      }
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la tentative échouée:', error);
    }
  },

  // Réinitialiser les tentatives après connexion réussie
  async resetLoginAttempts(email: string, ipAddress: string) {
    try {
      await supabase
        .from('login_attempts')
        .update({
          failed_attempts: 0,
          blocked_until: null
        })
        .eq('email', email.toLowerCase())
        .eq('ip_address', ipAddress);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des tentatives:', error);
    }
  },

  // Obtenir l'adresse IP du client
  async getClientIP(): Promise<string> {
    try {
      // En production, utilisez un service comme ipify ou récupérez l'IP depuis les headers
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }
};
