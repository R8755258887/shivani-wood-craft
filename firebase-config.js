// Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6CjAfM-z9RMb_CG808RuXEM27wkRNAXk",
  authDomain: "shivani-wood-craft-564dd.firebaseapp.com",
  projectId: "shivani-wood-craft-564dd",
  storageBucket: "shivani-wood-craft-564dd.firebasestorage.app",
  messagingSenderId: "554508321143",
  appId: "1:554508321143:web:a58b7d121becde6d30a172",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const db = getFirestore(app);
export const auth = getAuth(app);
