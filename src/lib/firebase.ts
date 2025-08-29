
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC9Jq4gd31w6MW9xKfGXJqYeA7u_zAot1o",
  authDomain: "study-buddy-sagar.firebaseapp.com",
  projectId: "study-buddy-sagar",
  storageBucket: "study-buddy-sagar.firebasestorage.app",
  messagingSenderId: "525468814257",
  appId: "1:525468814257:web:a50adbc574f0937f704b90"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
