<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dorry - Connexion</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="auth_styles.css">
    <script src="https://unpkg.com/lucide@latest"></script>
</head>
<body>
    <div class="particles" id="particles"></div>
    <div class="container">
        <div class="auth-card" id="loginCard">
            <div class="auth-header">
                <div class="auth-logo">Dorry</div>
                <div class="voice-waves">
                    <!-- ... -->
                </div>
                <p class="auth-subtitle">Votre assistante vocal intelligent vous attend</p>
            </div>

            <!-- FORM LOGIN -->
            <form class="auth-form" id="loginForm">
                <!-- ... (Email, Password, Remember me, bouton Se connecter) -->
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" class="form-input" placeholder="votre@email.com" required>
                    <i class="input-icon" data-lucide="mail"></i>
                    <div class="error-message" id="emailError">Veuillez entrer une adresse email valide</div>
                </div>
                <div class="form-group">
                    <label for="password" class="form-label">Mot de passe</label>
                    <input type="password" id="password" class="form-input" placeholder="••••••••" required>
                    <i class="input-icon" data-lucide="eye" id="togglePassword"></i>
                    <div class="error-message" id="passwordError">Mot de passe incorrect</div>
                </div>
                <div class="form-checkbox">
                    <input type="checkbox" id="rememberMe">
                    <label for="rememberMe" class="checkbox-label">Rester connecté</label>
                </div>
                <button type="submit" class="btn btn-primary btn-block" id="loginButton">
                    <span class="loading-spinner" id="loginSpinner"></span>
                    <span class="btn-content">Se connecter</span>
                </button>
                <div class="auth-footer">
                    <p>Vous n'avez pas de compte ? <a href="signup.html">Créer un compte</a></p>
                    <p><a href="#" id="forgotPassword">Mot de passe oublié ?</a></p>
                </div>
            </form>

            <!-- FORM MOT DE PASSE OUBLIÉ (caché par défaut) -->
            <form class="auth-form" id="forgotPasswordForm" style="display: none;">
                <!-- ... -->
            </form>

            <!-- (Optionnel) MFA -->
            <div class="mfa-container" id="mfaContainer" style="display: none;">
                <!-- ... -->
            </div>
        </div>
    </div>
    <div class="notification" id="notification">
        <span class="notification-icon" data-lucide="check-circle"></span>
        <span class="notification-message">Opération réussie</span>
    </div>
    <script>
        // Code JS : NE GARDE que ce qui concerne login/mot de passe/mfa.
        // Supprime les morceaux sur signup et password strength!
    </script>
</body>
</html>
