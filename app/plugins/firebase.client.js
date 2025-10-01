import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export default defineNuxtPlugin(async () => {
  const firebaseConfig = {
    apiKey: "AIzaSyD8cNE-CndnbRwyTw_28xc5-D1tUCc8PUA",
    authDomain: "alukov-worldwide-redesigned.firebaseapp.com",
    projectId: "alukov-worldwide-redesigned",
    storageBucket: "alukov-worldwide-redesigned.firebasestorage.app",
    messagingSenderId: "608690397709",
    appId: "1:608690397709:web:d405bce7f17038e4b22b44",
    measurementId: "G-2P520G209D",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const analytics = getAnalytics(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const auth = getAuth(app);

  await setPersistence(auth, browserLocalPersistence);

  return {
    provide: {
      firebase: app,
      analytics,
      db,
      storage,
      auth,
    },
  };
});
