
export const createAudioBlob = (chunks: Blob[], selectedMimeType: string, deviceInfo: { isIOS: boolean; isAndroid: boolean; isMobile: boolean }): Blob | null => {
  console.log('⏹️ Enregistrement arrêté, assemblage des chunks...');
  console.log('📦 Nombre de chunks:', chunks.length);
  console.log('📊 Détails des chunks:', chunks.map((chunk, i) => ({
    index: i,
    size: chunk.size,
    type: chunk.type
  })));
  
  if (chunks.length === 0) {
    console.error('❌ Aucun chunk audio disponible');
    return null;
  }

  const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
  console.log('📊 Taille totale des chunks:', totalSize, 'bytes');

  if (totalSize === 0) {
    console.error('❌ Taille totale nulle malgré la présence de chunks');
    return null;
  }

  // Créer le blob avec le bon type MIME selon la plateforme
  let finalMimeType;
  if (selectedMimeType) {
    finalMimeType = selectedMimeType;
  } else if (chunks[0]?.type) {
    finalMimeType = chunks[0].type;
  } else {
    // Fallback selon la plateforme
    finalMimeType = deviceInfo.isIOS ? 'audio/mp4' : 'audio/webm';
  }
  
  console.log('🎯 Type MIME final sélectionné:', finalMimeType);
  
  const audioBlob = new Blob(chunks, { type: finalMimeType });
  
  console.log('📦 Blob final créé:', {
    size: audioBlob.size,
    type: audioBlob.type,
    chunks: chunks.length,
    platform: deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : deviceInfo.isMobile ? 'Mobile' : 'Desktop',
    finalMimeType
  });
  
  if (audioBlob.size === 0) {
    console.error('❌ Blob audio final vide');
    return null;
  } else {
    console.log('✅ Blob audio valide créé');
    return audioBlob;
  }
};
