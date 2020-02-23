export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCkS2v2UUNwB1ClI9nnNGstkVBZcHpMLy8",
    authDomain: "catchdex-2aa7e.firebaseapp.com",
    databaseURL: "https://catchdex-2aa7e.firebaseio.com",
    projectId: "catchdex-2aa7e",
    storageBucket: "catchdex-2aa7e.appspot.com",
    messagingSenderId: "446704972713",
    appId: "1:446704972713:web:258110a757ef10c97c4ab8",
    measurementId: "G-9GL3RS1GVP"
  },
  googleWebClientId: '446704972713-s73s5csaakd726t2oqnds4ot8un57gab.apps.googleusercontent.com',
  id_app: 'CatchDex',
  sql_insert: `INSERT or IGNORE INTO `,
  sql_poke_columnas: ` VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21, ?22, ?23, ?24)`,
};

/*
ionic cordova plugin add cordova-plugin-googleplus --variable REVERSED_CLIENT_ID=com.googleusercontent.apps.446704972713-0sh2uu17q24ikhrkgu2end9egsh93dq9 --variable WEB_APPLICATION_CLIENT_ID=446704972713-s73s5csaakd726t2oqnds4ot8un57gab.apps.googleusercontent.com
*/
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
