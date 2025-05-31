import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { enhancedAuthService } from '@/services/enhancedAuthService';

const Login = () => {
  // États pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // États pour la gestion des erreurs et du chargement
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // État pour les animations d'ondes vocales
  const [isWaveAnimating, setIsWaveAnimating] = useState(true);

  const { login } = useAuth();
  const { toast } = useToast();
  
  // Fonction de validation d'email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialisation des erreurs
    setEmailError('');
    setPasswordError('');
    
    // Validation des champs
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Veuillez entrer votre email');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Veuillez entrer une adresse email valide');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Veuillez entrer votre mot de passe');
      isValid = false;
    }
    
    if (isValid) {
      setIsLoading(true);
      
      try {
        console.log('🚀 Tentative de connexion sécurisée pour:', email);
        
        const result = await enhancedAuthService.secureLogin({
          email: email.trim().toLowerCase(),
          password,
          rememberMe
        });

        if (result.success) {
          console.log('✅ Connexion réussie, redirection...');
          toast({
            title: "Connexion réussie",
            description: "Vous êtes maintenant connecté."
          });
          // Redirection vers la page principale
          window.location.href = '/app';
        } else {
          console.log('❌ Échec de la connexion - message sécurisé affiché');
          
          if (result.isBlocked) {
            toast({
              title: "Compte bloqué",
              description: result.message || "Trop de tentatives de connexion. Réessayez plus tard.",
              variant: "destructive"
            });
          } else {
            // Message d'erreur sécurisé
            setPasswordError(result.message || 'Identifiants incorrects');
          }
        }
      } catch (error) {
        console.error('💥 Erreur lors de la connexion:', error);
        // Message d'erreur générique pour la sécurité
        setPasswordError('Identifiants incorrects');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Effet pour l'animation des ondes vocales
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaveAnimating(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  const handleForgotPassword = () => {
    // Rediriger vers une vraie page de réinitialisation de mot de passe
    window.location.href = '/forgot-password';
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

          .login-body {
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
            max-width: 450px;
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
            font-size: 2.5rem;
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

          .auth-form {
            animation: slideIn 0.5s ease-out;
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .form-group {
            margin-bottom: 1.5rem;
            position: relative;
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

          .form-checkbox {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
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
            font-size: 0.875rem;
            color: var(--text-secondary);
            user-select: none;
          }

          .checkbox-label::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
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
            top: 0.25rem;
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

          .btn-primary:active {
            transform: translateY(1px);
          }

          .btn-block {
            display: block;
            width: 100%;
          }

          .btn-primary .btn-content {
            position: relative;
            z-index: 1;
          }

          .btn-primary::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.7s ease;
          }

          .btn-primary:hover::before {
            left: 100%;
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

          .forgot-password {
            text-align: center;
            margin-top: 1rem;
          }

          .forgot-password a {
            color: #FFFFFF !important;
            font-size: 0.875rem;
            text-decoration: none;
            transition: opacity 0.3s ease;
          }

          .forgot-password a:hover {
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
          }
        `
      }} />
      
      <div className="login-body">
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

        {/* Bouton retour en haut à gauche de la page */}
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
              <div className="auth-logo">Dorry</div>
              <div className="voice-waves">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`voice-wave ${isWaveAnimating ? 'animate-wave' : ''}`} 
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <p className="auth-subtitle">Connexion sécurisée à votre compte</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <div className="input-container">
                  <input 
                    type="email" 
                    id="email" 
                    className={`form-input ${emailError ? 'error' : ''}`}
                    placeholder="votre@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <label htmlFor="password" className="form-label">Mot de passe</label>
                <div className="input-container">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    className={`form-input ${passwordError ? 'error' : ''}`}
                    placeholder="••••••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
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
              </div>

              <div className="form-checkbox">
                <input 
                  type="checkbox" 
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="rememberMe" className="checkbox-label">
                  Rester connecté (max 24h, nécessite cookies de session)
                </label>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <span className="btn-content">Se connecter</span>
                )}
              </button>

              <div className="forgot-password">
                <a href="#" onClick={(e) => { e.preventDefault(); handleForgotPassword(); }}>
                  Mot de passe oublié ?
                </a>
              </div>

              <div className="auth-footer">
                <p>Vous n'avez pas de compte ? <a href="/signup">Créer un compte</a></p>
                <p style={{marginTop: '0.5rem', fontSize: '0.75rem'}}>
                  <a href="/privacy-policy">Politique de confidentialité</a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
