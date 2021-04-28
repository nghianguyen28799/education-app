import * as firebase from 'firebase'

import 'firebase/storage'

var firebaseConfig = {
    apiKey: "AIzaSyAJ7MCJm6ZFMZY4qSVxjSf8MA39pnTqMFM",
    authDomain: "edu-app-554bc.firebaseapp.com",
    projectId: "edu-app-554bc",
    storageBucket: "edu-app-554bc.appspot.com",
    messagingSenderId: "568294892756",
    appId: "1:568294892756:web:23ff5d6d3ba1e28e82c741",
    measurementId: "G-7TYGXBH7EB"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

export const database = firebase.firestore();
