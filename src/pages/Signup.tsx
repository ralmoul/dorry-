
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';

const Signup = () => {
  // États pour les champs du formulaire
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rgpdConsent, setRgpdConsent] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);
  
  // États pour la gestion des erreurs et du chargement
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [companyError, setCompanyError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [consentError, setConsentError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // État pour les animations d'ondes vocales
  const [isWaveAnimating, setIsWaveAnimating] = useState(true);
  
  // État pour la force du mot de passe
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: ''
  });

  const { signup } = useAuth();
  const { toast } = useToast();
  
  // Fonction de validation d'email
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  // Fonction de validation de téléphone français
  const validatePhone = (phone: string) => {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };
  
  // Calcul de la force du mot de passe
  const calculatePasswordStrength = (password: string) => {
    if (!password) {
      return { score: 0, message: '' };
    }
    
    let score = 0;
    
    // Longueur minimum 8 caractères
    if (password.length >= 8) {
      score += 1;
    }
    
    // Majuscules
    if (/[A-Z]/.test(password)) {
      score += 1;
    }
    
    // Chiffres
    if (/[0-9]/.test(password)) {
      score += 1;
    }
    
    // Caractères spéciaux
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    }
    
    let message = '';
    
    switch (score) {
      case 0:
      case 1:
        message = 'Faible';
        break;
      case 2:
        message = 'Moyen';
        break;
      case 3:
        message = 'Fort';
        break;
      case 4:
        message = 'Très fort';
        break;
    }
    
    return { score, message };
  };
  
  // Mise à jour de la force du mot de passe
  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(password));
  }, [password]);
  
  // Effet pour l'animation des ondes vocales
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWaveAnimating(prev => !prev);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Réinitialisation des erreurs
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPhoneError('');
    setCompanyError('');
    setPasswordError('');
    setConsentError('');
    
    // Validation des champs
    let isValid = true;
    
    if (!firstName.trim()) {
      setFirstNameError('Le prénom est obligatoire');
      isValid = false;
    }
    
    if (!lastName.trim()) {
      setLastNameError('Le nom est obligatoire');
      isValid = false;
    }
    
    if (!email.trim()) {
      setEmailError('L\'email est obligatoire');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Veuillez entrer une adresse email valide');
      isValid = false;
    }
    
    if (!phone.trim()) {
      setPhoneError('Le numéro de téléphone est obligatoire');
      isValid = false;
    } else if (!validatePhone(phone)) {
      setPhoneError('Veuillez entrer un numéro de téléphone français valide');
      isValid = false;
    }
    
    if (!company.trim()) {
      setCompanyError('Le nom de l\'entreprise est obligatoire');
      isValid = false;
    }
    
    if (!password) {
      setPasswordError('Le mot de passe est obligatoire');
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      isValid = false;
    } else if (passwordStrength.score < 2) {
      setPasswordError('Le mot de passe est trop faible. Utilisez majuscules, chiffres et caractères spéciaux');
      isValid = false;
    }

    if (!rgpdConsent || !termsConsent) {
      setConsentError('Vous devez accepter les conditions d\'utilisation et la politique de confidentialité');
      isValid = false;
    }
    
    if (isValid) {
      setIsLoading(true);
      
      try {
        console.log('🚀 Tentative de création de compte pour:', email);
        
        const result = await signup({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          company: company.trim(),
          password
        });

        if (result.success) {
          console.log('✅ Demande de création de compte envoyée avec succès');
          
          // Animation de confettis
          createConfetti();
          
          toast({
            title: "Demande envoyée !",
            description: "Votre demande de création de compte a été envoyée. Vous recevrez une confirmation une fois approuvée.",
          });

          // Réinitialiser le formulaire
          setFirstName('');
          setLastName('');
          setEmail('');
          setPhone('');
          setCompany('');
          setPassword('');
          setRgpdConsent(false);
          setTermsConsent(false);
          
          // Rediriger vers la page de connexion après 3 secondes
          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
          
        } else {
          console.log('❌ Échec de la création de compte:', result.message);
          
          // Gestion sécurisée des erreurs
          if (result.message?.includes('email')) {
            setEmailError('Cette adresse email est déjà utilisée');
          } else {
            toast({
              title: "Erreur",
              description: "Une erreur est survenue lors de la création du compte. Veuillez réessayer.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('💥 Erreur lors de la création du compte:', error);
        toast({
          title: "Erreur",
          description: "Une erreur technique est survenue. Veuillez réessayer plus tard.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // Fonction pour créer l'effet de confettis
  const createConfetti = () => {
    const confettiCount = 100;
    const colors = ['#00B8D4', '#6A11CB', '#10B981', '#F59E0B'];
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      
      // Taille aléatoire
      const size = Math.random() * 10 + 5;
      confetti.style.width = `${size}px`;
      confetti.style.height = `${size}px`;
      
      // Position aléatoire
      const posX = Math.random() * window.innerWidth;
      confetti.style.left = `${posX}px`;
      
      // Couleur aléatoire
      const colorIndex = Math.floor(Math.random() * colors.length);
      confetti.style.backgroundColor = colors[colorIndex];
      
      // Animation
      const animationDuration = Math.random() * 3 + 2;
      confetti.style.animation = `confetti-fall ${animationDuration}s ease-in-out forwards`;
      
      document.body.appendChild(confetti);
      
      // Supprimer après l'animation
      setTimeout(() => {
        confetti.remove();
      }, animationDuration * 1000);
    }
  };

  const handleBackToHome = () => {
    window.location.href = '/';
  };
  
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

          .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1.5rem;
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

          .password-strength {
            height: 4px;
            margin-top: 0.5rem;
            border-radius: 2px;
            background-color: var(--input-bg);
            overflow: hidden;
          }

          .password-strength-bar {
            height: 100%;
            width: 0;
            transition: width 0.3s ease, background-color 0.3s ease;
          }

          .password-strength-text {
            font-size: 0.75rem;
            margin-top: 0.25rem;
            text-align: right;
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
            align-items: flex-start;
            margin-bottom: 1rem;
            gap: 0.75rem;
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

          .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            background-color: #00B8D4;
            opacity: 0;
            z-index: 1000;
            pointer-events: none;
          }

          @keyframes confetti-fall {
            0% {
              opacity: 1;
              top: -10px;
              transform: translateX(0) rotate(0deg);
            }
            100% {
              opacity: 0;
              top: 100vh;
              transform: translateX(100px) rotate(360deg);
            }
          }

          .legal-links {
            font-size: 0.75rem;
            color: var(--text-secondary);
            text-align: center;
            margin-top: 1rem;
          }

          .legal-links a {
            color: #00B8D4;
            text-decoration: none;
          }

          .legal-links a:hover {
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

            .form-row {
              grid-template-columns: 1fr;
              gap: 0;
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
              <p className="auth-subtitle">Créez votre compte pour commencer</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">Prénom *</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    className={`form-input ${firstNameError ? 'error' : ''}`}
                    placeholder="Prénom" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  {firstNameError && <div className="error-message">{firstNameError}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Nom *</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    className={`form-input ${lastNameError ? 'error' : ''}`}
                    placeholder="Nom" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                  {lastNameError && <div className="error-message">{lastNameError}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email *</label>
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
                <label htmlFor="phone" className="form-label">Téléphone *</label>
                <div className="input-container">
                  <input 
                    type="tel" 
                    id="phone" 
                    className={`form-input ${phoneError ? 'error' : ''}`}
                    placeholder="+33 6 12 34 56 78" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                {phoneError && <div className="error-message">{phoneError}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="company" className="form-label">Entreprise *</label>
                <div className="input-container">
                  <input 
                    type="text" 
                    id="company" 
                    className={`form-input ${companyError ? 'error' : ''}`}
                    placeholder="Nom de votre entreprise" 
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
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
                    <path d="M8 2v4" />
                    <path d="M16 2v4" />
                    <rect width="18" height="18" x="3" y="4" rx="2" />
                    <path d="M3 10h18" />
                  </svg>
                </div>
                {companyError && <div className="error-message">{companyError}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Mot de passe * (min. 8 caractères)</label>
                <div className="input-container">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    className={`form-input ${passwordError ? 'error' : ''}`}
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
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
                <div className="password-strength">
                  <div 
                    className="password-strength-bar" 
                    style={{ 
                      width: `${passwordStrength.score * 25}%`,
                      backgroundColor: 
                        passwordStrength.score === 0 ? '#EF4444' :
                        passwordStrength.score === 1 ? '#F59E0B' :
                        passwordStrength.score === 2 ? '#F59E0B' :
                        passwordStrength.score === 3 ? '#10B981' : '#10B981'
                    }}
                  ></div>
                </div>
                <div className="password-strength-text">{passwordStrength.message}</div>
                {passwordError && <div className="error-message">{passwordError}</div>}
              </div>

              {/* Consentements RGPD */}
              <div className="form-checkbox">
                <input 
                  type="checkbox" 
                  id="rgpdConsent"
                  checked={rgpdConsent}
                  onChange={(e) => setRgpdConsent(e.target.checked)}
                  required
                />
                <label htmlFor="rgpdConsent" className="checkbox-label">
                  J'accepte la collecte et le traitement de mes données personnelles conformément à la 
                  <a href="/privacy-policy" target="_blank" rel="noopener noreferrer"> Politique de confidentialité</a>
                </label>
              </div>

              <div className="form-checkbox">
                <input 
                  type="checkbox" 
                  id="termsConsent"
                  checked={termsConsent}
                  onChange={(e) => setTermsConsent(e.target.checked)}
                  required
                />
                <label htmlFor="termsConsent" className="checkbox-label">
                  J'accepte les 
                  <a href="/terms-of-service" target="_blank" rel="noopener noreferrer"> Conditions Générales d'Utilisation</a>
                </label>
              </div>

              {consentError && <div className="error-message" style={{textAlign: 'center', marginBottom: '1rem'}}>{consentError}</div>}

              <button 
                type="submit" 
                className="btn btn-primary btn-block" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Traitement en cours...</span>
                  </>
                ) : (
                  <span className="btn-content">Demander l'accès</span>
                )}
              </button>

              <div className="legal-links">
                En créant un compte, vous acceptez nos 
                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer"> CGU</a> et notre 
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer"> Politique de confidentialité</a>
              </div>

              <div className="auth-footer">
                <p>Déjà un compte ? <a href="/login">Se connecter</a></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
