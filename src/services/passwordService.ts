
import { toast } from '@/hooks/use-toast';

export interface PasswordStrength {
  score: number; // 0-5
  feedback: string[];
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
}

export const passwordService = {
  // Vérifier la force du mot de passe
  checkPasswordStrength(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    // Vérifications de base
    const hasMinLength = password.length >= 12;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Calcul du score
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumbers) score++;
    if (hasSpecialChars) score++;

    // Bonus pour longueur supplémentaire
    if (password.length >= 16) score++;

    // Feedback détaillé
    if (!hasMinLength) feedback.push('Au moins 12 caractères requis');
    if (!hasUppercase) feedback.push('Au moins une majuscule requise');
    if (!hasLowercase) feedback.push('Au moins une minuscule requise');
    if (!hasNumbers) feedback.push('Au moins un chiffre requis');
    if (!hasSpecialChars) feedback.push('Au moins un caractère spécial requis');

    // Vérifications avancées
    if (this.hasCommonPatterns(password)) {
      feedback.push('Évitez les motifs courants (123, abc, etc.)');
      score = Math.max(0, score - 1);
    }

    if (this.hasRepeatedChars(password)) {
      feedback.push('Évitez les caractères répétés');
      score = Math.max(0, score - 1);
    }

    const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChars;

    return {
      score,
      feedback,
      isValid,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecialChars
    };
  },

  // Vérifier les motifs courants
  hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /123456/,
      /abcdef/,
      /qwerty/,
      /password/i,
      /admin/i,
      /login/i
    ];
    return commonPatterns.some(pattern => pattern.test(password));
  },

  // Vérifier les caractères répétés
  hasRepeatedChars(password: string): boolean {
    return /(.)\1{2,}/.test(password); // 3+ caractères identiques consécutifs
  },

  // Vérifier contre les mots de passe compromis (simulation)
  async checkPwnedPassword(password: string): Promise<boolean> {
    try {
      // En production, utilisez l'API HaveIBeenPwned
      // Pour la démo, on simule la vérification
      const commonPasswords = [
        'password123',
        'admin123',
        'qwerty123',
        '123456789',
        'password1',
        'azerty123'
      ];
      
      const isPwned = commonPasswords.some(common => 
        password.toLowerCase().includes(common.toLowerCase())
      );

      if (isPwned) {
        toast({
          title: "Mot de passe compromis",
          description: "Ce mot de passe a été trouvé dans des fuites de données. Choisissez-en un autre.",
          variant: "destructive"
        });
      }

      return isPwned;
    } catch (error) {
      console.error('Erreur lors de la vérification pwned:', error);
      return false;
    }
  },

  // Générer un mot de passe sécurisé
  generateSecurePassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const special = '!@#$%^&*(),.?":{}|<>';
    
    const all = uppercase + lowercase + numbers + special;
    let password = '';
    
    // Assurer qu'on a au moins un caractère de chaque type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    // Compléter avec des caractères aléatoires
    for (let i = 4; i < length; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    // Mélanger le mot de passe
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
};
