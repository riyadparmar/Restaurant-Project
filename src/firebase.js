// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


  const firebaseConfig = {
    apiKey: "AIzaSyB_MSxQKwH7yqW7AfO-9qspFkVp3gjKwq4",
    authDomain: "restaurant-7e710.firebaseapp.com",
    projectId: "restaurant-7e710",
    storageBucket: "restaurant-7e710.firebasestorage.app",
    messagingSenderId: "7253325916",
    appId: "1:7253325916:web:7d13da0829ef4351ad8e99",
    measurementId: "G-VL6FTG8MBH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);