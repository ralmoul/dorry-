import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { enhancedAuthService } from '@/services/enhancedAuthService';
import { PasswordStrengthIndicator } from '@/components/auth/PasswordStrengthIndicator';
import { PasswordStrength } from '@/services/passwordService';

const Signup = () => {
  // états pour les champs du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaveAnimating, setIsWaveAnimating] = useState(true);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength | null>(null);

  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  // Fonction pour vérifier si le formulaire est valide
  const isFormValid = () => {
    const hasAllFields = formData.firstName.trim() && 
                        formData.lastName.trim() && 
                        formData.email.trim() && 
                        formData.phone.trim() && 
                        formData.company.trim() && 
                        formData.password.trim();
    
    const hasValidEmail = validateEmail(formData.email);
    const hasValidPassword = formData.password.length >= 12;
    const hasConsents = acceptedTerms && acceptedPrivacy;
    
    return hasAllFields && hasValidEmail && hasValidPassword && hasConsents;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 Tentative de soumission du formulaire');
    
    setEmailError('');
    setPasswordError('');
    
    let isValid = true;
    
    // Validation des champs requis
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || 
        !formData.phone.trim() || !formData.company.trim() || !formData.password.trim()) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires.",
        variant: "destructive"
      });
      return;
    }
    
    // Validation de l'email
    if (!validateEmail(formData.email)) {
      setEmailError('Veuillez entrer une adresse email valide');
      isValid = false;
    }
    
    // Validation du mot de passe (minimum 12 caractères)
    if (formData.password.length < 12) {
      setPasswordError('Le mot de passe doit contenir au moins 12 caractères');
      isValid = false;
    }
    
    // Validation des consentements RGPD
    if (!acceptedTerms || !acceptedPrivacy) {
      toast({
        title: "Consentements requis",
        description: "Vous devez accepter les CGU et la Politique de confidentialité pour créer un compte.",
        variant: "destructive"
      });
      return;
    }
    
    if (isValid) {
      setIsLoading(true);
      
      try {
        console.log('🚀 Tentative d\'inscription sécurisée pour:', formData.email);
        
        const result = await enhancedAuthService.secureSignup(formData);
        console.log('📋 Résultat de l\'inscription:', result);

        if (result.success) {
          console.log('✅ Inscription réussie - affichage du toast de succès');
          toast({
            title: "Demande envoyée avec succès",
            description: result.message || "Votre demande de création de compte a été envoyée. Vous recevrez une confirmation une fois approuvée."
          });
          
          // Réinitialiser le formulaire
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            company: '',
            password: ''
          });
          setAcceptedTerms(false);
          setAcceptedPrivacy(false);
          
          // Navigation React Router avec délai pour que l'utilisateur voie le message
          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          console.log('❌ Échec de l\'inscription:', result.message);
          
          // Afficher l'erreur appropriée
          if (result.message) {
            if (result.message?.includes('mot de passe')) {
              setPasswordError(result.message);
            } else {
              toast({
                title: "Erreur",
                description: result.message,
                variant: "destructive"
              });
            }
          } else {
            toast({
              title: "Erreur",
              description: "Une erreur est survenue lors de la création du compte.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('💥 Erreur lors de l\'inscription:', error);
        toast({
          title: "Erreur",
          description: "Une erreur inattendue est survenue.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaveAnimating(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  const handleGoToPrivacyPolicy = () => {
    navigate('/privacy-policy');
  };

  const handleGoToTerms = () => {
    navigate('/terms-of-service');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          :root {
            --primary-gradient: linear-gradient(135deg, #00B8D4 0%, #6A11CB 100%);
            --secondary-gradient: linear-gradient(135deg, #00B8D4 0%, #3A1957 100%);
            --background-dark: #0F172A;
            --background-card: #1E293B;
            --text-primary: #FFFFFF;
            --text-secondary: #94A3B8;
            --success: #10B981;
            --error: #EF4444;
            --warning: #F59E0B;
            --input-bg: rgba(15, 23, 42, 0.6);
            --card-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            --button-shadow: 0 10px 15px -3px rgba(0, 184, 212, 0.3), 0 4px 6px -4px rgba(106, 17, 203, 0.4);
          }

          .signup-body {
            font-family: 'Inter', sans-serif;
            background-color: var(--background-dark);
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
            overflow-x: hidden;
          }

          .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            position: relative;
            z-index: 10;
          }

          .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .particle {
            position: absolute;
            background: var(--primary-gradient);
            border-radius: 50%;
            opacity: 0.2;
            animation: float 15s infinite ease-in-out;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(0);
            }
            25% {
              transform: translateY(-30px) translateX(15px);
            }
            50% {
              transform: translateY(-15px) translateX(-15px);
            }
            75% {
              transform: translateY(30px) translateX(10px);
            }
          }

          .auth-card {
            background-color: var(--background-card);
            border-radius: 16px;
            box-shadow: var(--card-shadow);
            padding: 2.5rem;
            width: 100%;
            max-width: 500px;
            margin: 0 auto;
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            animation: fadeIn 0.6s ease-out;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .auth-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(106, 17, 203, 0.1) 0%, rgba(15, 23, 42, 0) 70%);
            z-index: -1;
            animation: pulse 8s infinite;
          }

          @keyframes pulse {
            0%, 100% {
              opacity: 0.5;
            }
            50% {
              opacity: 0.8;
            }
          }

          .auth-header {
            text-align: center;
            margin-bottom: 2rem;
          }

          .auth-logo {
            font-size: 2rem;
            font-weight: 700;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: 0.5rem;
            animation: glow 3s infinite alternate;
          }

          @keyframes glow {
            from {
              text-shadow: 0 0 5px rgba(0, 184, 212, 0.5), 0 0 10px rgba(106, 17, 203, 0.5);
            }
            to {
              text-shadow: 0 0 10px rgba(0, 184, 212, 0.8), 0 0 20px rgba(106, 17, 203, 0.8);
            }
          }

          .auth-subtitle {
            color: var(--text-secondary);
            font-size: 1rem;
            margin-top: 0.5rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
            position: relative;
          }

          .form-group.half {
            display: inline-block;
            width: 48%;
            margin-right: 4%;
          }

          .form-group.half:nth-child(even) {
            margin-right: 0;
          }

          .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-secondary);
            transition: color 0.3s ease;
          }

          .input-container {
            position: relative;
          }

          .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 1rem;
            background-color: var(--input-bg);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: var(--text-primary);
            transition: all 0.3s ease;
            box-sizing: border-box;
          }

          .form-input:focus {
            outline: none;
            border-color: #00B8D4;
            box-shadow: 0 0 0 3px rgba(0, 184, 212, 0.2);
          }

          .form-input.error {
            border-color: var(--error);
          }

          .form-group:focus-within .form-label {
            color: #00B8D4;
          }

          .input-icon {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-secondary);
            cursor: pointer;
            transition: color 0.3s ease;
          }

          .input-icon:hover {
            color: var(--text-primary);
          }

          .error-message {
            color: var(--error);
            font-size: 0.75rem;
            margin-top: 0.25rem;
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          }

          @keyframes shake {
            10%, 90% {
              transform: translateX(-1px);
            }
            20%, 80% {
              transform: translateX(2px);
            }
            30%, 50%, 70% {
              transform: translateX(-4px);
            }
            40%, 60% {
              transform: translateX(4px);
            }
          }

          .consent-section {
            background-color: rgba(0, 184, 212, 0.05);
            border: 1px solid rgba(0, 184, 212, 0.2);
            border-radius: 8px;
            padding: 1rem;
            margin-bottom: 1.5rem;
          }

          .consent-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: #00B8D4;
            margin-bottom: 0.5rem;
          }

          .form-checkbox {
            display: flex;
            align-items: flex-start;
            margin-bottom: 0.75rem;
          }

          .form-checkbox input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
          }

          .checkbox-label {
            position: relative;
            padding-left: 2rem;
            cursor: pointer;
            font-size: 0.75rem;
            color: var(--text-secondary);
            user-select: none;
            line-height: 1.4;
          }

          .checkbox-label::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0.1rem;
            width: 1.25rem;
            height: 1.25rem;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            background-color: var(--input-bg);
            transition: all 0.3s ease;
          }

          .form-checkbox input:checked ~ .checkbox-label::before {
            background: var(--primary-gradient);
            border-color: transparent;
          }

          .checkbox-label::after {
            content: '';
            position: absolute;
            left: 0.45rem;
            top: 0.35rem;
            width: 0.35rem;
            height: 0.7rem;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .form-checkbox input:checked ~ .checkbox-label::after {
            opacity: 1;
          }

          .checkbox-label a {
            color: #FFFFFF !important;
            text-decoration: none;
            transition: opacity 0.3s ease;
          }

          .checkbox-label a:hover {
            opacity: 0.8;
            text-decoration: underline;
          }

          .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 500;
            text-align: center;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }

          .btn-primary {
            background: var(--primary-gradient);
            color: white;
            box-shadow: var(--button-shadow);
          }

          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 25px -5px rgba(0, 184, 212, 0.4), 0 10px 10px -5px rgba(106, 17, 203, 0.5);
          }

          .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }

          .btn-block {
            display: block;
            width: 100%;
          }

          .loading-spinner {
            display: inline-block;
            width: 1.5rem;
            height: 1.5rem;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-right: 0.5rem;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .voice-waves {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            height: 40px;
            margin: 1rem auto;
          }

          .voice-wave {
            width: 4px;
            height: 20px;
            background: var(--primary-gradient);
            border-radius: 2px;
            animation: wave 1.5s infinite ease-in-out;
          }

          .voice-wave:nth-child(2) {
            animation-delay: 0.2s;
          }

          .voice-wave:nth-child(3) {
            animation-delay: 0.4s;
          }

          .voice-wave:nth-child(4) {
            animation-delay: 0.6s;
          }

          .voice-wave:nth-child(5) {
            animation-delay: 0.8s;
          }

          @keyframes wave {
            0%, 100% {
              height: 10px;
            }
            50% {
              height: 30px;
            }
          }

          .auth-footer {
            text-align: center;
            margin-top: 1.5rem;
          }

          .auth-footer a {
            color: #FFFFFF !important;
            text-decoration: none;
            transition: opacity 0.3s ease;
          }

          .auth-footer a:hover {
            opacity: 0.8;
            text-decoration: underline;
          }

          @media (max-width: 768px) {
            .container {
              padding: 1rem;
            }
            
            .auth-card {
              padding: 1.5rem;
              max-width: 100%;
            }

            .form-group.half {
              display: block;
              width: 100%;
              margin-right: 0;
            }
          }
        `
      }} />
      
      <div className="signup-body">
        <div className="particles">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                animationDelay: `${Math.random() * 15}s`
              }}
            />
          ))}
        </div>

        <button 
          onClick={handleBackToHome} 
          className="absolute top-6 left-6 text-white hover:text-white/80 hover:bg-white/10 z-10 flex items-center gap-2 px-3 py-2 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Accueil
        </button>

        <div className="container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">Rejoindre Dorry</div>
              <div className="voice-waves">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`voice-wave ${isWaveAnimating ? 'animate-wave' : ''}`} 
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <p className="auth-subtitle">Créez votre compte sécurisé</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group half">
                <label htmlFor="firstName" className="form-label">Prénom *</label>
                <input 
                  type="text" 
                  id="firstName" 
                  className="form-input"
                  placeholder="Votre prénom" 
                  value={formData.firstName}
                  onChange={handleInputChange('firstName')}
                  required
                  autoComplete="given-name"
                />
              </div>

              <div className="form-group half">
                <label htmlFor="lastName" className="form-label">Nom *</label>
                <input 
                  type="text" 
                  id="lastName" 
                  className="form-input"
                  placeholder="Votre nom" 
                  value={formData.lastName}
                  onChange={handleInputChange('lastName')}
                  required
                  autoComplete="family-name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email *</label>
                <div className="input-container">
                  <input 
                    type="email" 
                    id="email" 
                    className={`form-input ${emailError ? 'error' : ''}`}
                    placeholder="votre@email.com" 
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    autoComplete="email"
                  />
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="input-icon" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                {emailError && <div className="error-message">{emailError}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Téléphone *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  className="form-input"
                  placeholder="+33 6 12 34 56 78" 
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                  required
                  autoComplete="tel"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company" className="form-label">Entreprise *</label>
                <input 
                  type="text" 
                  id="company" 
                  className="form-input"
                  placeholder="Nom de votre entreprise" 
                  value={formData.company}
                  onChange={handleInputChange('company')}
                  required
                  autoComplete="organization"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Mot de passe * (12 caractères minimum)</label>
                <div className="input-container">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    className={`form-input ${passwordError ? 'error' : ''}`}
                    placeholder="••••••••••••" 
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required
                    autoComplete="new-password"
                    minLength={12}
                  />
                  {showPassword ? (
                    <EyeOff 
                      className="input-icon w-5 h-5" 
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  ) : (
                    <Eye 
                      className="input-icon w-5 h-5" 
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  )}
                </div>
                {passwordError && <div className="error-message">{passwordError}</div>}
                
                <PasswordStrengthIndicator 
                  password={formData.password} 
                  onStrengthChange={setPasswordStrength}
                />
              </div>

              <div className="consent-section">
                <div className="consent-title">Consentements RGPD requis</div>
                
                <div className="form-checkbox">
                  <input 
                    type="checkbox" 
                    id="acceptTerms"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    required
                  />
                  <label htmlFor="acceptTerms" className="checkbox-label">
                    J'accepte les <button type="button" onClick={handleGoToTerms} className="text-white hover:opacity-80 transition-opacity underline">Conditions Générales d'Utilisation</button> *
                  </label>
                </div>
                
                <div className="form-checkbox">
                  <input 
                    type="checkbox" 
                    id="acceptPrivacy"
                    checked={acceptedPrivacy}
                    onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                    required
                  />
                  <label htmlFor="acceptPrivacy" className="checkbox-label">
                    J'accepte la <button type="button" onClick={handleGoToPrivacyPolicy} className="text-white hover:opacity-80 transition-opacity underline">Politique de Confidentialité</button> et le traitement de mes données personnelles *
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={isLoading || !isFormValid()}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  "Demander l'accès"
                )}
              </button>

              <div className="auth-footer">
                <p>Déjà un compte ? <button type="button" onClick={handleGoToLogin} className="text-white hover:opacity-80 transition-opacity">Se connecter</button></p>
                <p style={{marginTop: '0.5rem', fontSize: '0.75rem'}}>
                  <button type="button" onClick={handleGoToPrivacyPolicy} className="text-white hover:opacity-80 transition-opacity">Politique de confidentialité</button> • <button type="button" onClick={handleGoToTerms} className="text-white hover:opacity-80 transition-opacity">CGU</button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
