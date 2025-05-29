
import { User } from '@/types/auth';

export const buildFormData = (
  audioBlob: Blob,
  fileName: string,
  applicationId: string,
  propertyId: string,
  user: User,
  platform: string,
  finalMimeType: string,
  fileExtension: string,
  originalType: string
): FormData => {
  const formData = new FormData();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  formData.append('audio', audioBlob, fileName);
  formData.append('applicationId', applicationId);
  formData.append('property_id', propertyId);
  formData.append('userEmail', user.email);
  formData.append('userFirstName', user.firstName);
  formData.append('userLastName', user.lastName);
  formData.append('userCompany', user.company);
  formData.append('userType', 'authenticated');
  formData.append('timestamp', timestamp);
  formData.append('audioSize', audioBlob.size.toString());
  formData.append('audioType', finalMimeType);
  formData.append('audioFormat', fileExtension);
  formData.append('platform', platform);
  formData.append('originalType', originalType);
  formData.append('userAgent', navigator.userAgent);

  console.log('📦 [WEBHOOK] FormData préparé avec property_id:', {
    applicationId,
    property_id: propertyId,
    userType: 'authenticated',
    fileName,
    audioSize: audioBlob.size,
    audioType: finalMimeType,
    audioFormat: fileExtension,
    platform,
    originalType: originalType,
    userEmail: user.email
  });

  return formData;
};
