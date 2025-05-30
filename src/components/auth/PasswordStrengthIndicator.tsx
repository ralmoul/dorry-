
import React from 'react';
import { passwordService, PasswordStrength } from '@/services/passwordService';

interface PasswordStrengthIndicatorProps {
  password: string;
  onStrengthChange?: (strength: PasswordStrength) => void;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  onStrengthChange
}) => {
  const strength = passwordService.checkPasswordStrength(password);

  React.useEffect(() => {
    onStrengthChange?.(strength);
  }, [password, onStrengthChange]);

  if (!password) return null;

  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-orange-500';
    if (score <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 2) return 'Faible';
    if (score <= 3) return 'Moyen';
    if (score <= 4) return 'Fort';
    return 'Très fort';
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Barre de force */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-400">Force:</span>
        <div className="flex-1 bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength.score)}`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${strength.score >= 4 ? 'text-green-400' : strength.score >= 3 ? 'text-yellow-400' : 'text-red-400'}`}>
          {getStrengthText(strength.score)}
        </span>
      </div>

      {/* Critères */}
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className={`flex items-center space-x-1 ${strength.hasMinLength ? 'text-green-400' : 'text-red-400'}`}>
          <span>{strength.hasMinLength ? '✓' : '✗'}</span>
          <span>12+ caractères</span>
        </div>
        <div className={`flex items-center space-x-1 ${strength.hasUppercase ? 'text-green-400' : 'text-red-400'}`}>
          <span>{strength.hasUppercase ? '✓' : '✗'}</span>
          <span>Majuscule</span>
        </div>
        <div className={`flex items-center space-x-1 ${strength.hasLowercase ? 'text-green-400' : 'text-red-400'}`}>
          <span>{strength.hasLowercase ? '✓' : '✗'}</span>
          <span>Minuscule</span>
        </div>
        <div className={`flex items-center space-x-1 ${strength.hasNumbers ? 'text-green-400' : 'text-red-400'}`}>
          <span>{strength.hasNumbers ? '✓' : '✗'}</span>
          <span>Chiffre</span>
        </div>
        <div className={`flex items-center space-x-1 ${strength.hasSpecialChars ? 'text-green-400' : 'text-red-400'}`}>
          <span>{strength.hasSpecialChars ? '✓' : '✗'}</span>
          <span>Spécial</span>
        </div>
      </div>

      {/* Feedback */}
      {strength.feedback.length > 0 && (
        <div className="text-xs text-red-400 space-y-1">
          {strength.feedback.map((message, index) => (
            <div key={index}>• {message}</div>
          ))}
        </div>
      )}
    </div>
  );
};
