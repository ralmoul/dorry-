
import React from 'react';
import { Settings as SettingsComponent } from '@/components/Settings';

const Settings = () => {
  const handleBack = () => {
    window.history.back();
  };

  return <SettingsComponent onBack={handleBack} />;
};

export default Settings;
