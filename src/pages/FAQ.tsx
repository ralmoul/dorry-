
import React from 'react';
import { ArrowLeft } from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      question: "C'est quoi Dorry exactement ?",
      answer: "Dorry est un assistant vocal intelligent qui transforme tes échanges (vocaux ou réunions) en synthèses claires, actionnables et personnalisées, prêtes à être exploitées par les accompagnateurs et coachs de porteurs de projet."
    },
    {
      question: "Comment fonctionne Dorry ?",
      answer: "1. Tu envoies un enregistrement vocal (ou un fichier audio) de ton entretien.\n2. Dorry transcrit et analyse automatiquement la conversation, identifie les moments clés, les besoins, la motivation du porteur de projet…\n3. Tu reçois une synthèse ultra-lisible et personnalisée, directement dans ta boîte mail (ou via la plateforme)."
    },
    {
      question: "Est-ce sécurisé ? Mes données sont-elles protégées ?",
      answer: "Oui, la sécurité et la confidentialité de tes données sont notre priorité. Tes enregistrements et informations restent privés, ne sont jamais partagés à des tiers, et sont traités via des outils conformes RGPD."
    },
    {
      question: "Qui peut utiliser Dorry ?",
      answer: "Dorry s'adresse à tous les professionnels de l'accompagnement : incubateurs, structures publiques, réseaux d'accompagnement, coachs indépendants… Tu accompagnes des porteurs de projet ? Dorry te fera gagner du temps !"
    },
    {
      question: "Est-ce que je dois installer quelque chose ?",
      answer: "Non, tout se passe en ligne. Dorry fonctionne via la plateforme web : il te suffit d'un navigateur, rien à installer."
    },
    {
      question: "Puis-je personnaliser les synthèses ?",
      answer: "Oui ! Tu peux définir tes propres consignes de synthèse, la structure des rapports, et même ajouter des champs spécifiques selon tes besoins."
    },
    {
      question: "Combien de temps pour recevoir ma synthèse ?",
      answer: "C'est (presque) instantané ! Dès l'analyse terminée, tu reçois ton compte-rendu par email ou via la plateforme."
    },
    {
      question: "Est-ce que Dorry fait la différence entre plusieurs porteurs ?",
      answer: "Oui, chaque synthèse est liée au bon porteur et à l'accompagnateur correspondant, grâce à l'identification intelligente."
    },
    {
      question: "Comment contacter le support si j'ai un souci ?",
      answer: "Tu peux nous écrire via le formulaire de contact, à contact@dorry.app, ou laisser ton numéro : notre équipe te rappelle rapidement."
    },
    {
      question: "Puis-je tester Dorry gratuitement ?",
      answer: "Contacte-nous pour bénéficier d'un essai sur-mesure ou pour une démo adaptée à tes besoins !"
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{ color: '#000000' }}>
      {/* Add specific CSS overrides for this page only */}
      <style>
        {`
          .faq-page * {
            color: #000000 !important;
          }
          .faq-page .text-cyan-500 {
            color: #06b6d4 !important;
          }
          .faq-page .text-cyan-400 {
            color: #06b6d4 !important;
          }
          .faq-page .bg-clip-text {
            -webkit-text-fill-color: #000000 !important;
            background: none !important;
          }
          .faq-page .text-white {
            color: #000000 !important;
          }
          .faq-page .title-cyan {
            color: #06b6d4 !important;
          }
          .faq-page .title-gradient {
            color: #000000 !important;
          }
          .faq-page .title-black {
            color: #000000 !important;
          }
          .faq-page .gradient-title {
            background: linear-gradient(to right, #00B8D4, #6A11CB) !important;
            -webkit-background-clip: text !important;
            background-clip: text !important;
            -webkit-text-fill-color: transparent !important;
            color: transparent !important;
          }
        `}
      </style>
      
      <div className="faq-page">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 w-full z-50 py-3 md:py-4 bg-white/90 backdrop-blur-md shadow-lg border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center">
              <img src="/lovable-uploads/1ea529ec-4385-4e6a-b22b-75cc2778cfcd.png" alt="Dorry Logo" className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <a href="/#footer" className="flex items-center space-x-2 px-4 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-colors" style={{
            color: '#06b6d4'
          }}>
              <ArrowLeft className="w-4 h-4" />
              <span>Retour</span>
            </a>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-20 pb-16">
          <div className="container mx-auto px-4 md:px-8 max-w-4xl">
            <div className="bg-gray-50 rounded-xl p-8 md:p-12 border border-gray-200 shadow-lg">
              <h1 className="text-3xl md:text-4xl font-bold mb-8 gradient-title">
                FAQ — Dorry Voice AI
              </h1>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-6 title-black">Questions fréquentes</h2>
                </div>

                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 border border-gray-300 shadow-md">
                      <h3 className="text-xl font-bold text-cyan-500 mb-4">{faq.question}</h3>
                      <div className="text-lg leading-relaxed" style={{ color: '#374151' }}>
                        {faq.answer.split('\n').map((line, lineIndex) => (
                          <p key={lineIndex} className={lineIndex > 0 ? 'mt-2' : ''}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 md:p-8 border border-cyan-200 shadow-md text-center mt-12">
                  <h3 className="text-xl md:text-2xl font-bold text-cyan-500 mb-4">Une autre question ?</h3>
                  <p className="text-lg mb-6" style={{ color: '#374151' }}>
                    Contacte-nous, on est là pour toi !
                  </p>
                  <a href="/contact" className="inline-block bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105">
                    Nous contacter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-100 py-8 border-t border-gray-300">
          <div className="container mx-auto px-4 md:px-8 text-center">
            <p className="text-sm" style={{
            color: '#6b7280'
          }}>© 2025 Dorry. Tous droits réservés.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default FAQ;
