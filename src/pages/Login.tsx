import React, { useState, useEffect } from 'react';
import { AuthScreen } from '@/components/AuthScreen';

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
    
    if (!email) {
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
        // Simulation d'appel API - à remplacer par votre logique d'authentification
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Redirection après connexion réussie
        window.location.href = '/';
      } catch (error) {
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
  
  return (
    <AuthScreen>
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
          <p className="auth-subtitle">Votre assistante vocal intelligent vous attend</p>
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
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="input-icon cursor-pointer" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <>
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                    <line x1="2" x2="22" y1="2" y2="22" />
                  </>
                ) : (
                  <>
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
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
            <label htmlFor="rememberMe" className="checkbox-label">Rester connecté</label>
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

          <div className="auth-footer">
            <p>Vous n'avez pas de compte ? <a href="/signup">Créer un compte</a></p>
            <p><a href="/forgot-password">Mot de passe oublié ?</a></p>
          </div>
        </form>
      </div>
    </AuthScreen>
  );
};

export default Login;

