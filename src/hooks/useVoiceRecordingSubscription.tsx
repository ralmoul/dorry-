
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { VoiceRecording } from '@/types/auth';

interface UseVoiceRecordingSubscriptionProps {
  userId: string | undefined;
  onUpdate: (payload: any) => void;
  isAuthenticated: boolean;
}

export const useVoiceRecordingSubscription = ({
  userId,
  onUpdate,
  isAuthenticated
}: UseVoiceRecordingSubscriptionProps) => {
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      return;
    }

    console.log('📡 [RECORDINGS] Setting up realtime subscription for voice recordings');
    
    const channel = supabase
      .channel('voice-recordings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'voice_recordings',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('📡 [RECORDINGS] Realtime update received:', payload);
          onUpdate(payload);
        }
      )
      .subscribe((status) => {
        console.log('📡 [RECORDINGS] Subscription status:', status);
      });

    return () => {
      console.log('📡 [RECORDINGS] Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, onUpdate, isAuthenticated]);
};
