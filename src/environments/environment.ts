// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  signOn: "http://192.168.1.40:8062",
  // apiBase: 'http://13.229.243.107:97/api',
  apiBase: 'https://localhost:8745',
  clientURI: 'http://localhost:4200/auth/reset-password', //WANT TO ADD TO CONFIG FILE
  defaultauth: 'fackbackend',
  appName: 'CMS',
  storage: 'localStorage',
  firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
    measurementId: ''
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
