// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_-5-_htvX4YZadFzkavQ1W7ajBXFLC4g",
  authDomain: "shopclues-996a2.firebaseapp.com",
  projectId: "shopclues-996a2",
  storageBucket: "shopclues-996a2.firebasestorage.app",
  messagingSenderId: "255300139405",
  appId: "1:255300139405:web:8c7cf2b21202c1fb1aa5c4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};