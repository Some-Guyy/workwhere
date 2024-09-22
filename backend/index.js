// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcJO4tZEFZBmM_sSinX_y6dx1QqYxighg",
  authDomain: "workwhere-2b031.firebaseapp.com",
  projectId: "workwhere-2b031",
  storageBucket: "workwhere-2b031.appspot.com",
  messagingSenderId: "92414175273",
  appId: "1:92414175273:web:28f77998326d44b3cd1438",
  measurementId: "G-KMDW1XGQBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);