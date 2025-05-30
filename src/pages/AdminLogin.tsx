
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
  // États pour les champs du formulaire
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // États pour la gestion des erreurs et du chargement
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // État pour les animations d'ondes vocales
  const [isWaveAnimating, setIsWaveAnimating] = useState(true);

  const { login } = useAdminAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialisation des erreurs
    setPasswordError('');
    
    // Validation des champs
    let isValid = true;
    
    if (!password) {
      setPasswordError('Veuillez entrer le mot de passe administrateur');
      isValid = false;
    }
    
    if (isValid) {
      setIsLoading(true);
      
      try {
        console.log('🚀 Tentative de connexion administrateur...');
        
        const result = await login(password);

        if (result.success) {
          console.log('✅ Connexion admin réussie, redirection...');
          toast({
            title: "Accès administrateur autorisé",
            description: "Redirection vers le panel d'administration..."
          });
          navigate('/admin-dashboard');
        } else {
          console.log('❌ Échec de la connexion admin');
          setPasswordError(result.message || 'Mot de passe incorrect');
          setPassword('');
        }
      } catch (error) {
        console.error('💥 Erreur lors de la connexion admin:', error);
        setPasswordError('Mot de passe incorrect');
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
    navigate('/');
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

          .admin-login-body {
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
            color: #00B8D4;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .auth-footer a:hover {
            color: #6A11CB;
            text-decoration: underline;
          }

          .security-notice {
            background-color: rgba(245, 158, 11, 0.05);
            border: 1px solid rgba(245, 158, 11, 0.2);
            border-radius: 8px;
            padding: 0.75rem;
            margin-bottom: 1.5rem;
            font-size: 0.75rem;
            color: var(--text-secondary);
            text-align: center;
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
      
      <div className="admin-login-body">
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
              <p className="auth-subtitle">Administration - Accès sécurisé</p>
            </div>

            <div className="security-notice">
              🔐 Zone d'administration - Authentification requise
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Mot de passe administrateur</label>
                <div className="input-container">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    className={`form-input ${passwordError ? 'error' : ''}`}
                    placeholder="Entrez le mot de passe maître" 
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

              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Vérification...</span>
                  </>
                ) : (
                  <span className="btn-content">Accéder à l'administration</span>
                )}
              </button>

              <div className="auth-footer">
                <p style={{marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-secondary)'}}>
                  Accès restreint aux administrateurs système
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
