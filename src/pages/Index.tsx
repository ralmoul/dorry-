
import React, { useState } from 'react';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { Settings } from '@/components/Settings';
import UpcomingFeatures from './UpcomingFeatures';

const Index = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showUpcomingFeatures, setShowUpcomingFeatures] = useState(false);

  if (showUpcomingFeatures) {
    return (
      <UpcomingFeatures 
        onBack={() => setShowUpcomingFeatures(false)} 
      />
    );
  }

  if (showSettings) {
    return (
      <Settings 
        onBack={() => setShowSettings(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <VoiceRecorder
        onOpenSettings={() => setShowSettings(true)}
        onOpenUpcomingFeatures={() => setShowUpcomingFeatures(true)}
      />
    </div>
  );
};

export default Index;
