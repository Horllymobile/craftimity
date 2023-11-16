// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  PROD_URL: 'https://craftimity.vercel.app/api/v1',
  // BASE_URL: 'https://craftimity.vercel.app/api/v1',
  firebaseConfig: {
    apiKey: 'AIzaSyB3SK2Uzt3ZrqB4NXTV-SwjogB08viVBO4',
    authDomain: 'craftimity.firebaseapp.com',
    projectId: 'craftimity',
    storageBucket: 'craftimity.appspot.com',
    messagingSenderId: '536537889848',
    appId: '1:536537889848:web:3bcf5b525ab0eeccdafacd',
    measurementId: 'G-CT70TPNDEP',
  },
  BASE_URL: 'http://localhost:4000/api/v1',
  SUPABASE_URL: 'https://lxscyztmkcklnybwpymh.supabase.co',
  SUPABASE_API_KEY:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4c2N5enRta2NrbG55YndweW1oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5NDg1NTU4NiwiZXhwIjoyMDEwNDMxNTg2fQ.UKraSyGWLFdtR4cUxHd9fdQK4qGZ-C4w_EPw7d0SeN8',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
