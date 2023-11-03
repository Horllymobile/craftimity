import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.craftimity.craftimity-client',
  appName: 'Craftimity',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
};

export default config;
