
// Service pour la gestion sécurisée des mots de passe
export interface PasswordStrength {
  score: number; // 0-5
  isValid: boolean;
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumbers: boolean;
  hasSpecialChars: boolean;
  feedback: string[];
}

export const passwordService = {
  // Vérifier la force d'un mot de passe selon les critères ANSSI
  checkPasswordStrength(password: string): PasswordStrength {
    const minLength = 12;
    const feedback: string[] = [];
    
    // Critères de base
    const hasMinLength = password.length >= minLength;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    // Calcul du score
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumbers) score++;
    if (hasSpecialChars) score++;
    
    // Bonus pour longueur exceptionnelle
    if (password.length >= 20) score++;
    
    // Feedback utilisateur
    if (!hasMinLength) feedback.push('Au moins 12 caractères requis');
    if (!hasUppercase) feedback.push('Au moins une majuscule');
    if (!hasLowercase) feedback.push('Au moins une minuscule');
    if (!hasNumbers) feedback.push('Au moins un chiffre');
    if (!hasSpecialChars) feedback.push('Au moins un caractère spécial');
    
    // Vérifications supplémentaires de sécurité
    if (this.hasCommonPatterns(password)) {
      feedback.push('Évitez les motifs courants (123, abc, qwerty)');
      score = Math.max(0, score - 1);
    }
    
    const isValid = hasMinLength && hasUppercase && hasLowercase && hasNumbers && hasSpecialChars;
    
    return {
      score: Math.min(5, score),
      isValid,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumbers,
      hasSpecialChars,
      feedback
    };
  },

  // Détecter des motifs courants faibles
  hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /123+/,
      /abc+/i,
      /qwerty/i,
      /azerty/i,
      /password/i,
      /admin/i,
      /(.)\1{3,}/, // 4+ caractères identiques consécutifs
    ];
    
    return commonPatterns.some(pattern => pattern.test(password));
  },

  // Vérifier si un mot de passe est dans les listes "pwned" (simulation)
  async checkPwnedPassword(password: string): Promise<boolean> {
    try {
      // Simulation de vérification contre HaveIBeenPwned API
      // En production, utilisez l'API HaveIBeenPwned avec hash SHA-1
      
      // Hash simple pour la démo (NE PAS utiliser en production)
      const simpleHash = this.simpleHash(password.toLowerCase());
      
      // Simulation - quelques mots de passe courants "compromis"
      const commonPasswords = [
        'password', '123456', 'admin', 'qwerty', 'azerty',
        'password123', 'admin123', '12345678'
      ];
      
      return commonPasswords.includes(password.toLowerCase());
    } catch (error) {
      console.error('Erreur lors de la vérification pwned:', error);
      return false; // En cas d'erreur, on n'bloque pas l'utilisateur
    }
  },

  // Hash simple pour la simulation (NE PAS utiliser en production)
  simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  },

  // Générer un mot de passe sécurisé
  generateSecurePassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = uppercase + lowercase + numbers + symbols;
    let password = '';
    
    // Garantir au moins un caractère de chaque type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Compléter avec des caractères aléatoires
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Mélanger le mot de passe
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }
};
