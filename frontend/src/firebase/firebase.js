// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9kHd6GzzPNCLiDfxmi6z2skeiG3YWKlE",
  authDomain: "campus-lost-and-found-po-e5a3c.firebaseapp.com",
  projectId: "campus-lost-and-found-po-e5a3c",
  storageBucket: "campus-lost-and-found-po-e5a3c.firebasestorage.app",
  messagingSenderId: "788285922797",
  appId: "1:788285922797:web:a898ce744861a98ae59be4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);



export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account"
});

export default app;


