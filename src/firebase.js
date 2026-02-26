// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDHqKmJobNhA1G7YmM2viweNIw3NrFrkLY",
  authDomain: "jaybesinautos.firebaseapp.com",
  projectId: "jaybesinautos",
  storageBucket: "jaybesinautos.firebasestorage.app",
  messagingSenderId: "82052020038",
  appId: "1:82052020038:web:97715ca2ac7a5811809747"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
