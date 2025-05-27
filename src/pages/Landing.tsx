
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dorry - Assistante Vocale Intelligente</title>
    <style>
        /* Variables CSS */
        :root {
            /* Couleurs principales */
            --primary: #00B8D4;
            --primary-light: #64FFDA;
            --primary-dark: #0088A3;
            --secondary: #6A11CB;
            --secondary-light: #8C43EA;
            --secondary-dark: #4A0D8F;
            --accent: #FF5722;
            --accent-light: #FF8A65;
            --accent-dark: #E64A19;
            
            /* Couleurs de fond */
            --bg-dark: #0F172A;
            --bg-light: #1E293B;
            --bg-gradient: linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-light) 100%);
            
            /* Couleurs de texte */
            --text-white: #FFFFFF;
            --text-light: #E2E8F0;
            --text-muted: #94A3B8;
            
            /* Typographie */
            --font-heading: 'Montserrat', sans-serif;
            --font-body: 'Inter', sans-serif;
            --font-accent: 'Poppins', sans-serif;
            
            /* Espacements */
            --spacing-xs: 0.5rem;
            --spacing-sm: 1rem;
            --spacing-md: 2rem;
            --spacing-lg: 4rem;
            --spacing-xl: 8rem;
            
            /* Transitions */
            --transition-fast: 0.3s ease;
            --transition-medium: 0.5s ease;
            --transition-slow: 0.8s ease;
            
            /* Ombres */
            --shadow-sm: 0 4px 6px rgba(0, 0, 0, 0.1);
            --shadow-md: 0 10px 15px rgba(0, 0, 0, 0.1);
            --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
            
            /* Arrondis */
            --radius-sm: 4px;
            --radius-md: 8px;
            --radius-lg: 16px;
            --radius-full: 9999px;
        }

        /* Reset et base */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html {
            font-size: 16px;
            scroll-behavior: smooth;
        }

        body {
            font-family: var(--font-body);
            color: var(--text-white);
            background-color: var(--bg-dark);
            line-height: 1.6;
            overflow-x: hidden;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 var(--spacing-md);
        }

        h1, h2, h3, h4, h5, h6 {
            font-family: var(--font-heading);
            font-weight: 700;
            line-height: 1.2;
        }

        a {
            text-decoration: none;
            color: inherit;
            transition: color var(--transition-fast);
        }

        img {
            max-width: 100%;
            height: auto;
        }

        /* Navigation */
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            padding: var(--spacing-sm) 0;
            transition: background-color var(--transition-medium);
            backdrop-filter: blur(10px);
        }

        .navbar.scrolled {
            background-color: rgba(15, 23, 42, 0.9);
            box-shadow: var(--shadow-md);
        }

        .navbar .container {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .logo {
            display: flex;
            align-items: center;
        }

        .logo-img {
            height: 40px;
        }

        .nav-links {
            display: flex;
            gap: var(--spacing-md);
        }

        .nav-link {
            position: relative;
            font-weight: 500;
            padding: var(--spacing-xs) 0;
        }

        .nav-link::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 0;
            height: 2px;
            background-color: var(--primary);
            transition: width var(--transition-fast);
        }

        .nav-link:hover::after {
            width: 100%;
        }

        .nav-buttons {
            display: flex;
            gap: var(--spacing-sm);
        }

        /* Boutons */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.75rem 1.5rem;
            border-radius: var(--radius-md);
            font-weight: 600;
            transition: all var(--transition-fast);
            cursor: pointer;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: var(--text-white);
            box-shadow: 0 4px 15px rgba(0, 184, 212, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 184, 212, 0.4);
        }

        .btn-outline {
            background: transparent;
            border: 2px solid var(--primary);
            color: var(--primary);
        }

        .btn-outline:hover {
            background-color: rgba(0, 184, 212, 0.1);
        }

        .btn-text {
            background: transparent;
            color: var(--text-white);
            padding: 0.75rem 0;
        }

        .btn-text .arrow {
            margin-left: 0.5rem;
            transition: transform var(--transition-fast);
        }

        .btn-text:hover .arrow {
            transform: translateX(4px);
        }

        .btn-cta {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: var(--text-white);
            font-size: 1.1rem;
            padding: 1rem 2rem;
            border-radius: var(--radius-md);
            box-shadow: 0 8px 25px rgba(0, 184, 212, 0.5);
            position: relative;
            overflow: hidden;
        }

        .btn-cta::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.7s ease;
        }

        .btn-cta:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(0, 184, 212, 0.6);
        }

        .btn-cta:hover::before {
            left: 100%;
        }

        .pulse {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% {
                box-shadow: 0 0 0 0 rgba(0, 184, 212, 0.4);
            }
            70% {
                box-shadow: 0 0 0 15px rgba(0, 184, 212, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(0, 184, 212, 0);
            }
        }

        /* Hero Section */
        .hero {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            padding: var(--spacing-xl) 0;
            overflow: hidden;
        }

        .hero-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        .gradient-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--bg-dark) 0%, var(--secondary-dark) 100%);
            opacity: 0.8;
        }

        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        .hero .container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: var(--spacing-lg);
        }

        .hero-content {
            flex: 1;
            max-width: 600px;
        }

        .hero-title {
            font-size: 3.5rem;
            margin-bottom: var(--spacing-md);
            line-height: 1.1;
        }

        .hero-title .highlight {
            display: block;
            color: var(--primary);
            font-size: 4rem;
            margin: 0.2em 0;
        }

        .hero-subtitle {
            font-size: 1.2rem;
            color: var(--text-light);
            margin-bottom: var(--spacing-md);
        }

        .hero-cta {
            display: flex;
            gap: var(--spacing-md);
            align-items: center;
        }

        .hero-visual {
            flex: 1;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .hero-image {
            max-width: 100%;
            z-index: 2;
            transform-style: preserve-3d;
            transition: transform var(--transition-medium);
        }

        .voice-visualization {
            position: absolute;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1;
        }

        .wave {
            position: absolute;
            border-radius: 50%;
            border: 2px solid var(--primary);
            opacity: 0;
            transform: scale(0);
        }

        .wave-1 {
            width: 100px;
            height: 100px;
            animation: wave 3s infinite ease-out;
        }

        .wave-2 {
            width: 200px;
            height: 200px;
            animation: wave 3s infinite ease-out 0.5s;
        }

        .wave-3 {
            width: 300px;
            height: 300px;
            animation: wave 3s infinite ease-out 1s;
        }

        .wave-4 {
            width: 400px;
            height: 400px;
            animation: wave 3s infinite ease-out 1.5s;
        }

        @keyframes wave {
            0% {
                transform: scale(0);
                opacity: 0.8;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }

        .scroll-indicator {
            position: absolute;
            bottom: var(--spacing-md);
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--spacing-xs);
            opacity: 0.7;
            transition: opacity var(--transition-fast);
        }

        .scroll-indicator:hover {
            opacity: 1;
        }

        .scroll-indicator span {
            font-size: 0.9rem;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .scroll-arrow {
            width: 30px;
            height: 30px;
            border-right: 2px solid var(--primary);
            border-bottom: 2px solid var(--primary);
            transform: rotate(45deg);
            animation: scrollArrow 2s infinite;
        }

        @keyframes scrollArrow {
            0% {
                transform: rotate(45deg) translate(0, 0);
                opacity: 0.4;
            }
            50% {
                transform: rotate(45deg) translate(10px, 10px);
                opacity: 0.8;
            }
            100% {
                transform: rotate(45deg) translate(0, 0);
                opacity: 0.4;
            }
        }

        /* Section Headers */
        .section-header {
            text-align: center;
            margin-bottom: var(--spacing-lg);
        }

        .section-title {
            font-size: 2.5rem;
            margin-bottom: var(--spacing-sm);
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            color: transparent;
        }

        .section-subtitle {
            font-size: 1.2rem;
            color: var(--text-light);
            max-width: 700px;
            margin: 0 auto;
        }

        /* Revolution Section */
        .revolution {
            padding: var(--spacing-xl) 0;
            background-color: var(--bg-light);
            position: relative;
            overflow: hidden;
        }

        .revolution-visual {
            display: flex;
            align-items: center;
            gap: var(--spacing-lg);
            margin-top: var(--spacing-lg);
        }

        .hologram {
            flex: 1;
            position: relative;
        }

        .hologram-container {
            position: relative;
            width: 100%;
            padding-bottom: 75%;
        }

        .hologram-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 0 15px rgba(0, 184, 212, 0.5));
        }

        .hologram-reflection {
            position: absolute;
            bottom: -20%;
            left: 0;
            width: 100%;
            height: 20%;
            background: linear-gradient(to bottom, rgba(0, 184, 212, 0.2), transparent);
            transform: scaleY(-1);
            filter: blur(5px);
        }

        .hologram-glow {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(0, 184, 212, 0.1) 0%, transparent 70%);
            animation: glow 4s infinite alternate;
        }

        @keyframes glow {
            0% {
                opacity: 0.5;
            }
            100% {
                opacity: 1;
            }
        }

        .revolution-steps {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--spacing-md);
        }

        .step {
            padding: var(--spacing-md);
            background-color: rgba(30, 41, 59, 0.5);
            border-radius: var(--radius-md);
            border-left: 4px solid var(--primary);
            transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .step:hover {
            transform: translateX(5px);
            box-shadow: var(--shadow-md);
        }

        .step-number {
            font-family: var(--font-accent);
            font-size: 1.2rem;
            color: var(--primary);
            margin-bottom: var(--spacing-xs);
        }

        .step-title {
            font-size: 1.5rem;
            margin-bottom: var(--spacing-xs);
        }

        .step-description {
            color: var(--text-light);
        }

        /* Features Section */
        .features {
            padding: var(--spacing-xl) 0;
            background-color: var(--bg-dark);
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--spacing-md);
            margin-top: var(--spacing-lg);
        }

        .feature-card {
            background-color: rgba(30, 41, 59, 0.3);
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            transition: transform var(--transition-fast), box-shadow var(--transition-fast);
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .feature-card:hover {
            transform: translateY(-10px);
            box-shadow: var(--shadow-md);
        }

        .feature-icon {
            position: relative;
            width: 80px;
            height: 80px;
            margin-bottom: var(--spacing-md);
        }

        .icon {
            width: 100%;
            height: 100%;
            object-fit: contain;
            position: relative;
            z-index: 2;
        }

        .icon-bg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, var(--primary-dark) 0%, var(--secondary-dark) 100%);
            border-radius: 50%;
            filter: blur(15px);
            z-index: 1;
        }

        .feature-title {
            font-size: 1.5rem;
            margin-bottom: var(--spacing-sm);
        }

        .feature-description {
            color: var(--text-light);
            flex-grow: 1;
        }

        /* Why Dorry Section */
        .why-dorry {
            padding: var(--spacing-xl) 0;
            background-color: var(--bg-light);
        }

        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: var(--spacing-md);
            margin-top: var(--spacing-lg);
        }

        .benefit-card {
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            background-color: rgba(15, 23, 42, 0.5);
            transition: transform var(--transition-fast);
        }

        .benefit-card:hover {
            transform: scale(1.03);
        }

        .benefit-icon {
            width: 60px;
            height: 60px;
            margin-bottom: var(--spacing-sm);
        }

        .benefit-title {
            font-size: 1.3rem;
            margin-bottom: var(--spacing-sm);
            color: var(--primary);
        }

        .benefit-description {
            color: var(--text-light);
        }

        /* Testimonials */
        .testimonials {
            margin-top: var(--spacing-xl);
            padding: var(--spacing-lg);
            background-color: rgba(15, 23, 42, 0.7);
            border-radius: var(--radius-lg);
        }

        .testimonials-title {
            text-align: center;
            font-size: 1.8rem;
            margin-bottom: var(--spacing-lg);
        }

        .testimonial-carousel {
            position: relative;
            height: 250px;
            overflow: hidden;
        }

        .testimonial-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transform: translateX(50px);
            transition: opacity var(--transition-medium), transform var(--transition-medium);
        }

        .testimonial-slide.active {
            opacity: 1;
            transform: translateX(0);
        }

        .testimonial-content {
            background-color: rgba(30, 41, 59, 0.5);
            border-radius: var(--radius-md);
            padding: var(--spacing-md);
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .testimonial-text {
            font-size: 1.1rem;
            font-style: italic;
            color: var(--text-light);
            margin-bottom: var(--spacing-md);
        }

        .testimonial-author {
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
        }

        .author-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
        }

        .author-name {
            font-size: 1.1rem;
            margin-bottom: 0.2rem;
        }

        .author-position {
            font-size: 0.9rem;
            color: var(--text-muted);
        }

        .carousel-controls {
            display: flex;
            justify-content: center;
            gap: var(--spacing-sm);
            margin-top: var(--spacing-md);
        }

        .carousel-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: var(--text-muted);
            border: none;
            cursor: pointer;
            transition: background-color var(--transition-fast), transform var(--transition-fast);
        }

        .carousel-dot.active {
            background-color: var(--primary);
            transform: scale(1.2);
        }

        /* Stats */
        .stats {
            display: flex;
            justify-content: space-around;
            flex-wrap: wrap;
            margin-top: var(--spacing-xl);
            gap: var(--spacing-lg);
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 3rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: var(--spacing-xs);
        }

        .stat-label {
            font-size: 1.1rem;
            color: var(--text-light);
        }

        /* CTA Section */
        .cta-section {
            position: relative;
            padding: var(--spacing-xl) 0;
            text-align: center;
            overflow: hidden;
        }

        .cta-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
        }

        .gradient-animated {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, var(--primary-dark) 0%, var(--secondary-dark) 100%);
            opacity: 0.8;
            animation: gradientShift 10s ease infinite;
        }

        @keyframes gradientShift {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }

        .particles-animated {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .cta-title {
            font-size: 2.5rem;
            margin-bottom: var(--spacing-md);
            max-width: 800px;
            margin-left: auto;
            margin-right: auto;
        }

        .cta-subtitle {
            font-size: 1.2rem;
            color: var(--text-light);
            margin-bottom: var(--spacing-lg);
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }

        .confetti-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10;
        }

        /* Footer */
        .footer {
            background-color: var(--bg-dark);
            padding: var(--spacing-lg) 0 var(--spacing-md);
        }

        .footer-content {
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-lg);
            margin-bottom: var(--spacing-lg);
        }

        .footer-brand {
            flex: 1;
            min-width: 250px;
        }

        .footer-logo {
            height: 40px;
            margin-bottom: var(--spacing-sm);
        }

        .footer-description {
            color: var(--text-light);
            max-width: 300px;
        }

        .footer-links {
            flex: 2;
            display: flex;
            flex-wrap: wrap;
            gap: var(--spacing-lg);
        }

        .footer-column {
            flex: 1;
            min-width: 150px;
        }

        .footer-title {
            font-size: 1.2rem;
            margin-bottom: var(--spacing-md);
            color: var(--primary);
        }

        .footer-link {
            display: block;
            margin-bottom: var(--spacing-xs);
            color: var(--text-light);
            transition: color var(--transition-fast);
        }

        .footer-link:hover {
            color: var(--primary);
        }

        .footer-text {
            color: var(--text-light);
        }

        .footer-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: var(--spacing-md);
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .copyright {
            color: var(--text-muted);
            font-size: 0.9rem;
        }

        .social-links {
            display: flex;
            gap: var(--spacing-sm);
        }

        .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.1);
            transition: background-color var(--transition-fast), transform var(--transition-fast);
        }

        .social-link:hover {
            background-color: var(--primary);
            transform: translateY(-3px);
        }

        .social-link img {
            width: 18px;
            height: 18px;
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
            .hero-title {
                font-size: 3rem;
            }
            
            .hero-title .highlight {
                font-size: 3.5rem;
            }
            
            .hero .container {
                flex-direction: column;
                text-align: center;
            }
            
            .hero-content {
                max-width: 100%;
            }
            
            .hero-cta {
                justify-content: center;
            }
            
            .revolution-visual {
                flex-direction: column;
            }
        }

        @media (max-width: 768px) {
            .navbar .container {
                flex-wrap: wrap;
            }
            
            .nav-links {
                order: 3;
                width: 100%;
                margin-top: var(--spacing-sm);
                justify-content: center;
            }
            
            .hero-title {
                font-size: 2.5rem;
            }
            
            .hero-title .highlight {
                font-size: 3rem;
            }
            
            .section-title {
                font-size: 2rem;
            }
            
            .stats {
                flex-direction: column;
                align-items: center;
            }
            
            .footer-content {
                flex-direction: column;
            }
            
            .footer-bottom {
                flex-direction: column;
                gap: var(--spacing-md);
            }
        }

        @media (max-width: 480px) {
            .hero-title {
                font-size: 2rem;
            }
            
            .hero-title .highlight {
                font-size: 2.5rem;
            }
            
            .hero-cta {
                flex-direction: column;
                width: 100%;
            }
            
            .btn {
                width: 100%;
            }
            
            .section-title {
                font-size: 1.8rem;
            }
        }

        /* Animation Classes */
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity var(--transition-medium), transform var(--transition-medium);
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .slide-in-left {
            opacity: 0;
            transform: translateX(-50px);
            transition: opacity var(--transition-medium), transform var(--transition-medium);
        }

        .slide-in-left.visible {
            opacity: 1;
            transform: translateX(0);
        }

        .slide-in-right {
            opacity: 0;
            transform: translateX(50px);
            transition: opacity var(--transition-medium), transform var(--transition-medium);
        }

        .slide-in-right.visible {
            opacity: 1;
            transform: translateX(0);
        }

        .scale-in {
            opacity: 0;
            transform: scale(0.8);
            transition: opacity var(--transition-medium), transform var(--transition-medium);
        }

        .scale-in.visible {
            opacity: 1;
            transform: scale(1);
        }

        /* Typing Animation */
        .typing-text {
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            border-right: 3px solid var(--primary);
            animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
        }

        @keyframes typing {
            from { width: 0 }
            to { width: 100% }
        }

        @keyframes blink-caret {
            from, to { border-color: transparent }
            50% { border-color: var(--primary) }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="container">
            <a href="#" class="logo">
                <img src="https://votre-url-de-logo.com/logo_sans_texte.png" alt="Dorry Logo" class="logo-img">
            </a>
            <div class="nav-links">
                <a href="#" class="nav-link">Accueil</a>
                <a href="#" class="nav-link">Fonctionnalités</a>
                <a href="#" class="nav-link">Tarifs</a>
                <a href="#" class="nav-link">Contact</a>
            </div>
            <div class="nav-buttons">
                <a href="#" class="btn btn-outline">Se connecter</a>
                <a href="#" class="btn btn-primary">S'inscrire</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section avec animation d'entrée -->
    <section class="hero">
        <div class="hero-bg">
            <div class="gradient-bg"></div>
            <div class="particles"></div>
        </div>
        <div class="container">
            <div class="hero-content">
                <h1 class="hero-title">
                    <span class="typing-text">Dorry, l'assistante IA qui</span>
                    <span class="highlight">révolutionne</span>
                    <span class="typing-text">vos réunions</span>
                </h1>
                <p class="hero-subtitle">Captez chaque moment, analysez en profondeur, et obtenez des comptes rendus précis sans lever le petit doigt.</p>
                <div class="hero-cta">
                    <a href="#" class="btn btn-primary pulse">Essayez gratuitement</a>
                    <a href="#" class="btn btn-text">Voir la démo <span class="arrow">→</span></a>
                </div>
            </div>
            <div class="hero-visual">
                <div class="voice-visualization">
                    <!-- Animation d'ondes vocales -->
                    <div class="wave wave-1"></div>
                    <div class="wave wave-2"></div>
                    <div class="wave wave-3"></div>
                    <div class="wave wave-4"></div>
                </div>
                <img src="https://votre-url-d-image.com/dorry_assistant_3d.png" alt="Dorry Assistant IA" class="hero-image">
            </div>
        </div>
        <div class="scroll-indicator">
            <span>Découvrir</span>
            <div class="scroll-arrow"></div>
        </div>
    </section>

    <!-- Section "Comment Dorry révolutionne vos réunions" -->
    <section class="revolution">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Comment Dorry révolutionne vos réunions</h2>
                <p class="section-subtitle">Une expérience immersive qui transforme votre façon de travailler</p>
            </div>
            <div class="revolution-visual">
                <div class="hologram">
                    <!-- Effet holographique 3D -->
                    <div class="hologram-container">
                        <img src="https://votre-url-d-image.com/reunion_hologram.png" alt="Réunion avec Dorry" class="hologram-image">
                        <div class="hologram-reflection"></div>
                        <div class="hologram-glow"></div>
                    </div>
                </div>
                <div class="revolution-steps">
                    <div class="step" data-step="1">
                        <div class="step-number">01</div>
                        <h3 class="step-title">Enregistrement intelligent</h3>
                        <p class="step-description">Dorry capture chaque mot, chaque nuance, même quand vous êtes concentré sur l'essentiel.</p>
                    </div>
                    <div class="step" data-step="2">
                        <div class="step-number">02</div>
                        <h3 class="step-title">Analyse en temps réel</h3>
                        <p class="step-description">L'IA identifie les points clés, les décisions et les actions à entreprendre.</p>
                    </div>
                    <div class="step" data-step="3">
                        <div class="step-number">03</div>
                        <h3 class="step-title">Synthèse instantanée</h3>
                        <p class="step-description">Un compte-rendu structuré et précis disponible en quelques minutes.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Section "Fonctionnalités clés" avec animations -->
    <section class="features">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Fonctionnalités qui font la différence</h2>
                <p class="section-subtitle">Découvrez comment Dorry simplifie votre quotidien professionnel</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <img src="https://votre-url-d-icone.com/icon_voice.png" alt="Parlez, Dorry écoute" class="icon">
                        <div class="icon-bg"></div>
                    </div>
                    <h3 class="feature-title">Parlez, Dorry écoute</h3>
                    <p class="feature-description">Enregistrez vos réunions ou entretiens, même en mains libres, avec une qualité audio exceptionnelle.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <img src="https://votre-url-d-icone.com/icon_analysis.png" alt="Analyse instantanée" class="icon">
                        <div class="icon-bg"></div>
                    </div>
                    <h3 class="feature-title">Analyse instantanée par IA</h3>
                    <p class="feature-description">Dorry comprend chaque échange, détecte les points clés, les adresses, les RDV pris...</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <img src="https://votre-url-d-icone.com/icon_detection.png" alt="Détection avancée" class="icon">
                        <div class="icon-bg"></div>
                    </div>
                    <h3 class="feature-title">Détection avancée</h3>
                    <p class="feature-description">Repère automatiquement les adresses et vérifie si votre porteur de projet est en QPV.</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <img src="https://votre-url-d-icone.com/icon_report.png" alt="Compte rendu détaillé" class="icon">
                        <div class="icon-bg"></div>
                    </div>
                    <h3 class="feature-title">Compte rendu détaillé</h3>
                    <p class="feature-description">Recevez une synthèse claire livrée en moins de 5 minutes, complète, prête à être archivée.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Section "Pourquoi choisir Dorry" avec témoignages -->
    <section class="why-dorry">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Pourquoi choisir Dorry ?</h2>
                <p class="section-subtitle">Des avantages concrets pour votre productivité</p>
            </div>
            <div class="benefits-grid">
                <div class="benefit-card">
                    <div class="benefit-icon">
                        <img src="https://votre-url-d-icone.com/icon_time.png" alt="Gagnez du temps" class="icon">
                    </div>
                    <h3 class="benefit-title">Gagnez un temps précieux</h3>
                    <p class="benefit-description">Plus besoin de rédiger ou de mémoriser chaque échange. Concentrez-vous sur l'humain, Dorry s'occupe du reste.</p>
                </div>
                <div class="benefit-card">
                    <div class="benefit-icon">
                        <img src="https://votre-url-d-icone.com/icon_reliability.png" alt="Fiabilité sans faille" class="icon">
                    </div>
                    <h3 class="benefit-title">Fiabilité sans faille</h3>
                    <p class="benefit-description">Finis les oublis de compte rendu, même après une journée chargée.</p>
                </div>
                <div class="benefit-card">
                    <div class="benefit-icon">
                        <img src="https://votre-url-d-icone.com/icon_ai.png" alt="Analyse IA intelligente" class="icon">
                    </div>
                    <h3 class="benefit-title">Analyse IA intelligente</h3>
                    <p class="benefit-description">Dorry reste connectée et attentive, même quand l'humain décroche. Chaque détail important est capturé.</p>
                </div>
                <div class="benefit-card">
                    <div class="benefit-icon">
                        <img src="https://votre-url-d-icone.com/icon_innovation.png" alt="Évolutif & innovant" class="icon">
                    </div>
                    <h3 class="benefit-title">Évolutif & innovant</h3>
                    <p class="benefit-description">Des mises à jour régulières : Scoring automatique, recommandations intelligentes, messages WhatsApp personnalisés.</p>
                </div>
            </div>
            
            <!-- Témoignages avec carrousel -->
            <div class="testimonials">
                <h3 class="testimonials-title">Ce que nos utilisateurs disent</h3>
                <div class="testimonial-carousel">
                    <div class="testimonial-slide active">
                        <div class="testimonial-content">
                            <p class="testimonial-text">"Dorry a complètement transformé nos réunions d'équipe. Nous gagnons au moins 2 heures par semaine sur la rédaction des comptes rendus."</p>
                            <div class="testimonial-author">
                                <img src="https://votre-url-d-avatar.com/avatar_1.jpg" alt="Sophie M." class="author-avatar">
                                <div class="author-info">
                                    <h4 class="author-name">Sophie M.</h4>
                                    <p class="author-position">Directrice de projet</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="testimonial-slide">
                        <div class="testimonial-content">
                            <p class="testimonial-text">"La précision de l'analyse est bluffante. Dorry capte des détails que j'aurais manqués, même en prenant des notes."</p>
                            <div class="testimonial-author">
                                <img src="https://votre-url-d-avatar.com/avatar_2.jpg" alt="Thomas L." class="author-avatar">
                                <div class="author-info">
                                    <h4 class="author-name">Thomas L.</h4>
                                    <p class="author-position">Consultant</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="testimonial-slide">
                        <div class="testimonial-content">
                            <p class="testimonial-text">"L'intégration de Dorry dans notre workflow a augmenté notre productivité de 30%. Un investissement qui vaut vraiment le coup."</p>
                            <div class="testimonial-author">
                                <img src="https://votre-url-d-avatar.com/avatar_3.jpg" alt="Julie D." class="author-avatar">
                                <div class="author-info">
                                    <h4 class="author-name">Julie D.</h4>
                                    <p class="author-position">CEO Startup</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="carousel-controls">
                    <button class="carousel-dot active" data-slide="0"></button>
                    <button class="carousel-dot" data-slide="1"></button>
                    <button class="carousel-dot" data-slide="2"></button>
                </div>
            </div>
            
            <!-- Statistiques animées -->
            <div class="stats">
                <div class="stat-item">
                    <h3 class="stat-number" data-count="87">0</h3>
                    <p class="stat-label">% de temps gagné sur la rédaction</p>
                </div>
                <div class="stat-item">
                    <h3 class="stat-number" data-count="98">0</h3>
                    <p class="stat-label">% de précision dans les analyses</p>
                </div>
                <div class="stat-item">
                    <h3 class="stat-number" data-count="5">0</h3>
                    <p class="stat-label">minutes pour un compte rendu complet</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Section finale avec appel à l'action -->
    <section class="cta-section">
        <div class="cta-bg">
            <div class="gradient-animated"></div>
            <div class="particles-animated"></div>
        </div>
        <div class="container">
            <h2 class="cta-title">Rejoignez la nouvelle génération d'accompagnateurs augmentés par l'IA !</h2>
            <p class="cta-subtitle">L'esprit libre, le suivi assuré. Essayez dès maintenant et faites la différence.</p>
            <a href="#" class="btn btn-cta" id="cta-button">Commencer gratuitement</a>
            <div class="confetti-container" id="confetti"></div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-brand">
                    <img src="https://votre-url-de-logo.com/logo_sans_texte.png" alt="Dorry" class="footer-logo">
                    <p class="footer-description">L'assistante IA qui révolutionne l'accompagnement de projet</p>
                </div>
                <div class="footer-links">
                    <div class="footer-column">
                        <h4 class="footer-title">Légal</h4>
                        <a href="#" class="footer-link">Politique de confidentialité</a>
                        <a href="#" class="footer-link">Conditions d'utilisation</a>
                        <a href="#" class="footer-link">Mentions légales</a>
                    </div>
                    <div class="footer-column">
                        <h4 class="footer-title">Support</h4>
                        <a href="#" class="footer-link">Aide & Contact</a>
                        <a href="#" class="footer-link">FAQ</a>
                        <a href="#" class="footer-link">Tutoriels</a>
                    </div>
                    <div class="footer-column">
                        <h4 class="footer-title">Innovation</h4>
                        <p class="footer-text">C'est le début d'une nouvelle ère pour l'accompagnement de projet.</p>
                    </div>
                </div>
            </div>
            <div class="footer-bottom">
                <p class="copyright">© 2025 Dorry. Tous droits réservés.</p>
                <div class="social-links">
                    <a href="#" class="social-link"><img src="https://votre-url-d-icone.com/icon_linkedin.png" alt="LinkedIn"></a>
                    <a href="#" class="social-link"><img src="https://votre-url-d-icone.com/icon_twitter.png" alt="Twitter"></a>
                    <a href="#" class="social-link"><img src="https://votre-url-d-icone.com/icon_instagram.png" alt="Instagram"></a>
                </div>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script>
        // Attendre que le DOM soit chargé
        document.addEventListener('DOMContentLoaded', function() {
            // Animation du header au scroll
            window.addEventListener('scroll', function() {
                const navbar = document.querySelector('.navbar');
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
            
            // Animation du titre principal avec effet de frappe
            const heroTitle = document.querySelectorAll('.typing-text');
            heroTitle.forEach((element, index) => {
                let delay = index * 1.5;
                element.style.width = '0';
                setTimeout(() => {
                    element.style.animation = `typing 3.5s steps(40, end) forwards, blink-caret 0.75s step-end infinite`;
                }, delay * 1000);
            });
            
            // Animation de l'image principale avec effet 3D
            const heroImage = document.querySelector('.hero-image');
            if (heroImage) {
                document.addEventListener('mousemove', function(e) {
                    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
                    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
                    heroImage.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
                });
                
                // Réinitialiser la rotation quand la souris quitte la zone
                document.addEventListener('mouseleave', function() {
                    heroImage.style.transform = 'rotateY(0deg) rotateX(0deg)';
                });
            }
            
            // Animations au scroll
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, observerOptions);
            
            // Observer les éléments avec animation
            document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
                observer.observe(el);
            });
            
            // Animation du carrousel de témoignages
            const testimonialSlides = document.querySelectorAll('.testimonial-slide');
            const dots = document.querySelectorAll('.carousel-dot');
            let currentSlide = 0;
            
            function showSlide(index) {
                testimonialSlides.forEach(slide => {
                    slide.classList.remove('active');
                });
                dots.forEach(dot => {
                    dot.classList.remove('active');
                });
                
                testimonialSlides[index].classList.add('active');
                dots[index].classList.add('active');
                currentSlide = index;
            }
            
            // Changer de slide automatiquement toutes les 5 secondes
            setInterval(() => {
                let nextSlide = (currentSlide + 1) % testimonialSlides.length;
                showSlide(nextSlide);
            }, 5000);
            
            // Changer de slide en cliquant sur les points
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    showSlide(index);
                });
            });
            
            // Animation des compteurs de statistiques
            const statNumbers = document.querySelectorAll('.stat-number');
            
            function animateCounter(el) {
                const target = parseInt(el.getAttribute('data-count'));
                const duration = 2000; // 2 secondes
                const step = target / duration * 10;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        clearInterval(timer);
                        el.textContent = target;
                    } else {
                        el.textContent = Math.floor(current);
                    }
                }, 10);
            }
            
            // Observer pour les compteurs
            const statsObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        statsObserver.unobserve(entry.target);
                    }
                });
            }, observerOptions);
            
            statNumbers.forEach(stat => {
                statsObserver.observe(stat);
            });
            
            // Animation du bouton CTA avec effet de confettis
            const ctaButton = document.getElementById('cta-button');
            const confettiContainer = document.getElementById('confetti');
            
            if (ctaButton && confettiContainer) {
                ctaButton.addEventListener('click', function(e) {
                    // Empêcher la navigation pour la démo
                    e.preventDefault();
                    
                    // Créer des confettis
                    for (let i = 0; i < 100; i++) {
                        createConfetti();
                    }
                });
            }
            
            function createConfetti() {
                const confetti = document.createElement('div');
                confetti.style.position = 'absolute';
                confetti.style.width = `${Math.random() * 10 + 5}px`;
                confetti.style.height = `${Math.random() * 10 + 5}px`;
                confetti.style.backgroundColor = getRandomColor();
                confetti.style.borderRadius = '50%';
                confetti.style.left = `${Math.random() * 100}%`;
                confetti.style.top = `${Math.random() * 20 + 40}%`;
                
                confettiContainer.appendChild(confetti);
                
                // Animation de chute
                const duration = Math.random() * 2 + 1;
                const keyframes = [
                    { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
                    { transform: `translate(${Math.random() * 200 - 100}px, 500px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
                ];
                
                const animation = confetti.animate(keyframes, {
                    duration: duration * 1000,
                    easing: 'ease-out',
                    fill: 'forwards'
                });
                
                animation.onfinish = () => {
                    confetti.remove();
                };
            }
            
            function getRandomColor() {
                const colors = ['#00B8D4', '#6A11CB', '#FF5722', '#64FFDA', '#8C43EA'];
                return colors[Math.floor(Math.random() * colors.length)];
            }
            
            // Créer des particules pour l'arrière-plan
            function createParticles(container, count) {
                for (let i = 0; i < count; i++) {
                    const particle = document.createElement('div');
                    
                    // Styles de base pour les particules
                    particle.style.position = 'absolute';
                    particle.style.borderRadius = '50%';
                    particle.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    
                    // Propriétés aléatoires
                    const size = Math.random() * 5 + 2;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;
                    particle.style.left = `${Math.random() * 100}%`;
                    particle.style.top = `${Math.random() * 100}%`;
                    
                    container.appendChild(particle);
                    
                    // Animation des particules
                    const keyframes = [
                        { transform: 'translate(0, 0)', opacity: Math.random() * 0.5 + 0.3 },
                        { transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`, opacity: Math.random() * 0.5 + 0.3 }
                    ];
                    
                    particle.animate(keyframes, {
                        duration: Math.random() * 10000 + 10000,
                        direction: 'alternate',
                        iterations: Infinity,
                        easing: 'ease-in-out'
                    });
                }
            }
            
            // Créer des particules dans les sections avec arrière-plan
            const particlesContainer = document.querySelector('.particles');
            const particlesAnimated = document.querySelector('.particles-animated');
            
            if (particlesContainer) {
                createParticles(particlesContainer, 50);
            }
            
            if (particlesAnimated) {
                createParticles(particlesAnimated, 50);
            }
            
            // Effet parallaxe au scroll
            const parallaxElements = document.querySelectorAll('.hero-visual, .hologram');
            window.addEventListener('scroll', function() {
                const scrollPosition = window.pageYOffset;
                
                parallaxElements.forEach(element => {
                    const speed = 0.1;
                    const yPos = -scrollPosition * speed;
                    element.style.transform = `translateY(${yPos}px)`;
                });
            });
        });
    </script>
</body>
</html>