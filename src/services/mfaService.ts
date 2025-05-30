
import { supabase } from '@/integrations/supabase/client';
import { securityService } from './securityService';

export interface MFASettings {
  id?: string;
  user_id: string;
  mfa_enabled: boolean;
  mfa_method: 'totp' | 'email' | 'sms';
  totp_secret?: string;
  backup_codes?: string[];
  phone_number?: string;
  is_verified: boolean;
}

export const mfaService = {
  // Générer un secret TOTP
  generateTOTPSecret(): { secret: string; qrCodeUrl: string } {
    const secret = this.generateRandomSecret();
    const appName = 'Dorry.app';
    const issuer = 'Dorry';
    
    // URL pour QR Code (compatible Google Authenticator)
    const qrCodeUrl = `otpauth://totp/${encodeURIComponent(appName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
    
    return { secret, qrCodeUrl };
  },

  // Générer un secret aléatoire
  generateRandomSecret(length: number = 32): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < length; i++) {
      secret += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return secret;
  },

  // Vérifier un code TOTP (simulation - en production utiliser une bibliothèque comme otplib)
  verifyTOTPCode(secret: string, code: string): boolean {
    // Simulation de vérification TOTP
    // En production, utilisez une bibliothèque comme 'otplib' ou 'speakeasy'
    const timeWindow = Math.floor(Date.now() / 30000);
    const expectedCode = this.generateTOTPCode(secret, timeWindow);
    
    // Vérifier le code actuel et les fenêtres adjacentes (tolérance ±30s)
    return code === expectedCode || 
           code === this.generateTOTPCode(secret, timeWindow - 1) ||
           code === this.generateTOTPCode(secret, timeWindow + 1);
  },

  // Générer un code TOTP (simulation)
  generateTOTPCode(secret: string, timeWindow: number): string {
    // Simulation simplifiée - en production utiliser une vraie implémentation TOTP
    const hash = this.simpleHash(secret + timeWindow.toString());
    return (hash % 1000000).toString().padStart(6, '0');
  },

  // Hash simple pour la simulation
  simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  },

  // Obtenir les paramètres MFA de l'utilisateur
  async getUserMFASettings(userId: string): Promise<MFASettings | null> {
    try {
      const { data, error } = await supabase
        .from('user_mfa_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erreur lors de la récupération des paramètres MFA:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres MFA:', error);
      return null;
    }
  },

  // Activer la MFA pour un utilisateur
  async enableMFA(userId: string, method: 'totp' | 'email' | 'sms', secret?: string, phoneNumber?: string): Promise<boolean> {
    try {
      const backupCodes = this.generateBackupCodes();
      
      const { error } = await supabase
        .from('user_mfa_settings')
        .upsert({
          user_id: userId,
          mfa_enabled: true,
          mfa_method: method,
          totp_secret: secret,
          backup_codes: backupCodes,
          phone_number: phoneNumber,
          is_verified: false
        });

      if (error) {
        console.error('Erreur lors de l\'activation de la MFA:', error);
        return false;
      }

      // Journaliser l'activation de la MFA
      await securityService.logSecurityEvent({
        user_id: userId,
        event_type: 'mfa_enabled',
        details: { method }
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'activation de la MFA:', error);
      return false;
    }
  },

  // Désactiver la MFA
  async disableMFA(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_mfa_settings')
        .update({
          mfa_enabled: false,
          is_verified: false,
          totp_secret: null,
          backup_codes: null
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Erreur lors de la désactivation de la MFA:', error);
        return false;
      }

      // Journaliser la désactivation de la MFA
      await securityService.logSecurityEvent({
        user_id: userId,
        event_type: 'mfa_disabled',
        details: {}
      });

      return true;
    } catch (error) {
      console.error('Erreur lors de la désactivation de la MFA:', error);
      return false;
    }
  },

  // Générer des codes de récupération
  generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = Math.random().toString(36).substr(2, 8).toUpperCase();
      codes.push(code);
    }
    return codes;
  },

  // Vérifier un code de récupération
  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    try {
      const settings = await this.getUserMFASettings(userId);
      if (!settings || !settings.backup_codes) {
        return false;
      }

      const codeIndex = settings.backup_codes.indexOf(code.toUpperCase());
      if (codeIndex === -1) {
        return false;
      }

      // Supprimer le code utilisé
      const updatedCodes = [...settings.backup_codes];
      updatedCodes.splice(codeIndex, 1);

      await supabase
        .from('user_mfa_settings')
        .update({ backup_codes: updatedCodes })
        .eq('user_id', userId);

      return true;
    } catch (error) {
      console.error('Erreur lors de la vérification du code de récupération:', error);
      return false;
    }
  }
};
