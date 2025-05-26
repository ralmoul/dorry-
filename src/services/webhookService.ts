import { User } from '@/types/auth';

const WEBHOOK_URL = 'https://n8n-4m8i.onrender.com/webhook-test/d4e8f563-b641-484a-8e40-8ef6564362f2';

export const sendAudioToWebhook = async (audioBlob: Blob, user: User | null) => {
  console.log('🚀 [WEBHOOK] Début de l\'envoi vers:', WEBHOOK_URL);
  console.log('📊 [WEBHOOK] Taille du fichier audio:', audioBlob.size, 'bytes');
  console.log('🎵 [WEBHOOK] Type audio:', audioBlob.type);
  console.log('👤 [WEBHOOK] Utilisateur:', user?.email || 'non connecté');
  
  try {
    const formData = new FormData();
    
    // Créer un nom de fichier avec l'extension appropriée
    const timestamp = new Date().toISOString();
    const isMP4 = audioBlob.type.includes('mp4');
    const extension = isMP4 ? 'mp4' : 'webm';
    const fileName = `recording_${user?.id || 'unknown'}_${Date.now()}.${extension}`;
    
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

    console.log('📤 [WEBHOOK] Données à envoyer:', {
      fileName,
      audioSize: audioBlob.size,
      audioType: audioBlob.type,
      audioFormat: extension,
      userId: user?.id,
      userEmail: user?.email,
      userFirstName: user?.firstName,
      userLastName: user?.lastName,
      userCompany: user?.company,
      timestamp
    });

    console.log('🌐 [WEBHOOK] Envoi de la requête POST...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ [WEBHOOK] Timeout atteint, annulation...');
      controller.abort();
    }, 60000); // 60 secondes

    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
      // Pas de headers personnalisés pour FormData
    });

    clearTimeout(timeoutId);

    console.log('📨 [WEBHOOK] Réponse reçue:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (response.ok) {
      let responseData;
      const contentType = response.headers.get('content-type');
      
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
      
      console.log('✅ [WEBHOOK] Envoi réussi!');
      return { success: true, message: "Message transmis" };
    } else {
      console.error('❌ [WEBHOOK] Erreur HTTP:', response.status, response.statusText);
      
      // Essayer de lire le corps de la réponse d'erreur
      let errorBody;
      try {
        errorBody = await response.text();
        console.error('📄 [WEBHOOK] Corps de l\'erreur:', errorBody);
      } catch (e) {
        console.error('⚠️ [WEBHOOK] Impossible de lire le corps de l\'erreur');
      }
      
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}${errorBody ? ' - ' + errorBody : ''}`);
    }
  } catch (error) {
    console.error('💥 [WEBHOOK] Erreur détaillée lors de l\'envoi:', error);
    
    let errorMessage = "Impossible de transmettre le message.";
    
    if (error instanceof Error) {
      console.error('📝 [WEBHOOK] Message d\'erreur:', error.message);
      console.error('🔍 [WEBHOOK] Stack trace:', error.stack);
      
      if (error.name === 'AbortError') {
        errorMessage = "Timeout: La transmission a pris trop de temps.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Erreur de connexion. Vérifiez votre connexion internet.";
      } else if (error.message.includes('NetworkError')) {
        errorMessage = "Erreur réseau. Le serveur n'est peut-être pas accessible.";
      } else if (error.message.includes('ERR_NETWORK')) {
        errorMessage = "Erreur réseau. Le webhook n'est peut-être pas accessible.";
      } else {
        errorMessage = `Erreur: ${error.message}`;
      }
    }

    // Sauvegarder localement en cas d'échec
    try {
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log('💾 [WEBHOOK] Audio sauvegardé localement. URL:', audioUrl);
      
      // Optionnel: télécharger automatiquement le fichier
      const a = document.createElement('a');
      a.href = audioUrl;
      const isMP4 = audioBlob.type.includes('mp4');
      const extension = isMP4 ? 'mp4' : 'webm';
      a.download = `recording_backup_${Date.now()}.${extension}`;
      console.log('⬇️ [WEBHOOK] Lien de téléchargement créé');
    } catch (saveError) {
      console.error('💥 [WEBHOOK] Impossible de sauvegarder localement:', saveError);
    }

    throw new Error(errorMessage);
  } finally {
    console.log('🏁 [WEBHOOK] Processus terminé');
  }
};
