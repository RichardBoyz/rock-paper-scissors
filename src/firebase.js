// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAU5mppDj2XXhk1iydGvitwckl7wlAAsQo",
  authDomain: "rock-paper-scissors-4a35f.firebaseapp.com",
  projectId: "rock-paper-scissors-4a35f",
  storageBucket: "rock-paper-scissors-4a35f.appspot.com",
  messagingSenderId: "137670997610",
  appId: "1:137670997610:web:cc99441cb773ee68a9bc13",
  measurementId: "G-KJN3EKRDE2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
