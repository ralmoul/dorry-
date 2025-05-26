
import { User } from '@/types/auth';

const WEBHOOK_URL = 'https://n8n-4m8i.onrender.com/webhook/d4e8f563-b641-484a-8e40-8ef6564362f2';

export const sendAudioToWebhook = async (audioBlob: Blob, user: User | null) => {
  console.log('🚀 [WEBHOOK] DÉBUT - URL utilisée:', WEBHOOK_URL);
  console.log('🚀 [WEBHOOK] DÉBUT - Taille audio:', audioBlob.size, 'bytes');
  console.log('🚀 [WEBHOOK] DÉBUT - Type audio:', audioBlob.type);
  console.log('🚀 [WEBHOOK] DÉBUT - Utilisateur:', user?.email || 'non connecté');
  
  // Vérification stricte de l'URL
  if (WEBHOOK_URL !== 'https://n8n-4m8i.onrender.com/webhook/d4e8f563-b641-484a-8e40-8ef6564362f2') {
    console.error('❌ [WEBHOOK] ERREUR CRITIQUE: URL incorrecte!');
    console.error('❌ [WEBHOOK] URL actuelle:', WEBHOOK_URL);
    console.error('❌ [WEBHOOK] URL attendue: https://n8n-4m8i.onrender.com/webhook/d4e8f563-b641-484a-8e40-8ef6564362f2');
    throw new Error('URL webhook incorrecte');
  }
  
  console.log('✅ [WEBHOOK] URL vérifiée et correcte');
  
  // Vérification de la taille du fichier
  if (audioBlob.size === 0) {
    console.error('❌ [WEBHOOK] ERREUR: Fichier audio vide!');
    throw new Error('Fichier audio vide');
  }
  
  if (audioBlob.size > 25 * 1024 * 1024) { // 25MB limit
    console.error('❌ [WEBHOOK] ERREUR: Fichier trop volumineux:', audioBlob.size, 'bytes');
    throw new Error('Fichier audio trop volumineux (max 25MB)');
  }
  
  console.log('✅ [WEBHOOK] Taille du fichier validée');
  
  try {
    const formData = new FormData();
    
    // Créer un nom de fichier avec l'extension appropriée
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const isMP4 = audioBlob.type.includes('mp4');
    const extension = isMP4 ? 'mp4' : 'webm';
    const fileName = `recording_${user?.id || 'unknown'}_${Date.now()}.${extension}`;
    
    console.log('📝 [WEBHOOK] Nom du fichier:', fileName);
    
    // Ajouter tous les champs au FormData
    formData.append('audio', audioBlob, fileName);
    formData.append('userId', user?.id || 'unknown');
    formData.append('userEmail', user?.email || 'unknown');
    formData.append('userFirstName', user?.firstName || 'unknown');
    formData.append('userLastName', user?.lastName || 'unknown');
    formData.append('userCompany', user?.company || 'unknown');
    formData.append('timestamp', timestamp);
    formData.append('audioSize', audioBlob.size.toString());
    formData.append('audioType', audioBlob.type);
    formData.append('audioFormat', extension);

    console.log('📦 [WEBHOOK] FormData préparé avec les champs:');
    console.log('   - audio: fichier de', audioBlob.size, 'bytes');
    console.log('   - userId:', user?.id || 'unknown');
    console.log('   - userEmail:', user?.email || 'unknown');
    console.log('   - userFirstName:', user?.firstName || 'unknown');
    console.log('   - userLastName:', user?.lastName || 'unknown');
    console.log('   - userCompany:', user?.company || 'unknown');
    console.log('   - timestamp:', timestamp);
    console.log('   - audioSize:', audioBlob.size.toString());
    console.log('   - audioType:', audioBlob.type);
    console.log('   - audioFormat:', extension);

    console.log('🌐 [WEBHOOK] ENVOI vers:', WEBHOOK_URL);
    console.log('🌐 [WEBHOOK] Méthode: POST');
    console.log('🌐 [WEBHOOK] Content-Type: multipart/form-data (automatique)');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ [WEBHOOK] TIMEOUT après 30 secondes');
      controller.abort();
    }, 30000); // 30 secondes

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('📨 [WEBHOOK] RÉPONSE reçue:');
    console.log('   - Status:', response.status);
    console.log('   - StatusText:', response.statusText);
    console.log('   - Headers:', Object.fromEntries(response.headers.entries()));
    console.log('   - URL finale:', response.url);

    if (response.ok) {
      let responseData;
      const contentType = response.headers.get('content-type');
      
      console.log('📋 [WEBHOOK] Type de contenu de la réponse:', contentType);
      
      try {
        if (contentType && contentType.includes('application/json')) {
          responseData = await response.json();
          console.log('📋 [WEBHOOK] Réponse JSON:', responseData);
        } else {
          responseData = await response.text();
          console.log('📄 [WEBHOOK] Réponse texte:', responseData);
        }
      } catch (parseError) {
        console.log('⚠️ [WEBHOOK] Impossible de parser la réponse:', parseError);
        responseData = 'Réponse reçue mais non parsable';
      }
      
      console.log('✅ [WEBHOOK] SUCCÈS - Transmission réussie!');
      console.log('✅ [WEBHOOK] Données envoyées vers N8N avec succès');
      
      return { 
        success: true, 
        message: "Message vocal transmis avec succès vers N8N",
        response: responseData,
        url: WEBHOOK_URL
      };
    } else {
      console.error('❌ [WEBHOOK] ERREUR HTTP:');
      console.error('   - Status:', response.status);
      console.error('   - StatusText:', response.statusText);
      console.error('   - URL:', response.url);
      
      let errorBody;
      try {
        errorBody = await response.text();
        console.error('📄 [WEBHOOK] Corps de l\'erreur:', errorBody);
      } catch (e) {
        console.error('⚠️ [WEBHOOK] Impossible de lire le corps de l\'erreur');
      }
      
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}${errorBody ? ' - ' + errorBody : ''}`);
    }
  } catch (error) {
    console.error('💥 [WEBHOOK] ERREUR CRITIQUE:');
    console.error('💥 [WEBHOOK] Type d\'erreur:', error?.constructor?.name);
    console.error('💥 [WEBHOOK] Message:', error instanceof Error ? error.message : String(error));
    console.error('💥 [WEBHOOK] Stack:', error instanceof Error ? error.stack : 'Pas de stack trace');
    
    let errorMessage = "Transmission impossible vers N8N.";
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = "Timeout: La transmission vers N8N a pris trop de temps.";
        console.error('⏰ [WEBHOOK] Timeout détecté');
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Erreur de connexion vers N8N. Vérifiez votre connexion internet.";
        console.error('🌐 [WEBHOOK] Erreur de fetch détectée');
      } else if (error.message.includes('NetworkError')) {
        errorMessage = "Erreur réseau. Le serveur N8N n'est peut-être pas accessible.";
        console.error('📡 [WEBHOOK] Erreur réseau détectée');
      } else {
        errorMessage = `Erreur N8N: ${error.message}`;
        console.error('🔍 [WEBHOOK] Erreur spécifique détectée');
      }
    }

    // Sauvegarder localement en cas d'échec
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('💾 [WEBHOOK] Audio sauvegardé localement. URL:', audioUrl);
      
      // Créer un lien de téléchargement automatique
      const a = document.createElement('a');
      a.href = audioUrl;
      const isMP4 = audioBlob.type.includes('mp4');
      const extension = isMP4 ? 'mp4' : 'webm';
      a.download = `recording_backup_${Date.now()}.${extension}`;
      console.log('⬇️ [WEBHOOK] Lien de téléchargement créé:', a.download);
    } catch (saveError) {
      console.error('💥 [WEBHOOK] Impossible de sauvegarder localement:', saveError);
    }

    console.log('🏁 [WEBHOOK] FIN avec erreur');
    throw new Error(errorMessage);
  } finally {
    console.log('🏁 [WEBHOOK] Processus terminé pour:', WEBHOOK_URL);
  }
};
