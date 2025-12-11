import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDv1THYkXLUnKFrhQo5_0XW391pA3lDW7E",
    authDomain: "nyembotech-156d0.firebaseapp.com",
    databaseURL: "https://nyembotech-156d0.firebaseio.com",
    projectId: "nyembotech-156d0",
    storageBucket: "nyembotech-156d0.firebasestorage.app",
    messagingSenderId: "357851594143",
    appId: "1:357851594143:web:019866c4fe11112b63d1aa",
    measurementId: "G-EYPN3KF4EV"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
