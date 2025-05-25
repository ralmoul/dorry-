
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.2a0a9a8ca9b947d7bbb21f8d724fd9a8',
  appName: 'Dory - Assistant Vocal',
  webDir: 'dist',
  server: {
    url: "https://2a0a9a8c-a9b9-47d7-bbb2-1f8d724fd9a8.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#0a0a0f",
      showSpinner: false
    }
  }
};

export default config;
