// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth'; // Import auth

const firebaseConfig = {
  // apiKey: "AIzaSyD7EqMUFLJXvUVGUr-MlEJMrjSqxdDUnOU",
  // authDomain: "scroller-4d10f.firebaseapp.com",
  // databaseURL: "https://scroller-4d10f-default-rtdb.firebaseio.com",
  // projectId: "scroller-4d10f",
  // storageBucket: "scroller-4d10f.appspot.com",
  // messagingSenderId: "1053362115345",
  // appId: "1:1053362115345:web:1e42a1c584dae0765a32b0",
  // measurementId: "G-7Y65NLWMKL"
  apiKey: "AIzaSyAA_wVVtYrTTn_-vzslIQ-6L3Bc4Vh8TXU",
  authDomain: "smartpracharakpro.firebaseapp.com",
  databaseURL: "https://smartpracharakpro-default-rtdb.firebaseio.com",
  projectId: "smartpracharakpro",
  storageBucket: "smartpracharakpro.firebasestorage.app",
  messagingSenderId: "129702576828",
  appId: "1:129702576828:web:c94e054a2da7d4e9e306b9",
  measurementId: "G-W478ME9D3W"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Export Realtime Database and Auth
const database = getDatabase(app);
const auth = getAuth(app);

export { app, auth, database };
export default database;
