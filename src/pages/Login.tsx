
import React, { useState, useEffect } from 'react';

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

  // Effet pour afficher les erreurs
  useEffect(() => {
    if (emailError) {
      const errorElement = document.querySelector('.error-message[data-field="email"]');
      if (errorElement) {
        (errorElement as HTMLElement).style.display = 'block';
      }
    }
    if (passwordError) {
      const errorElement = document.querySelector('.error-message[data-field="password"]');
      if (errorElement) {
        (errorElement as HTMLElement).style.display = 'block';
      }
    }
  }, [emailError, passwordError]);

  // Effet pour l'animation du spinner de chargement
  useEffect(() => {
    const spinner = document.querySelector('.loading-spinner');
    if (spinner) {
      (spinner as HTMLElement).style.display = isLoading ? 'inline-block' : 'none';
    }
  }, [isLoading]);
  
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Styles pour les nouvelles interfaces de login et signup de Dorry.app */

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
            display: none;
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
            display: none;
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
            color: #00B8D4;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .auth-footer a:hover {
            color: #6A11CB;
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
                {emailError && <div className="error-message" data-field="email">{emailError}</div>}
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
                    className="input-icon" 
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
                {passwordError && <div className="error-message" data-field="password">{passwordError}</div>}
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
        </div>
      </div>
    </>
  );
};

export default Login;
