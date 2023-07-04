// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDRfq2KK84sqAX5jrZON8T_8kLW-bKqOhA",
  authDomain: "white-9a82b.firebaseapp.com",
  projectId: "white-9a82b",
  storageBucket: "white-9a82b.appspot.com",
  messagingSenderId: "890115125945",
  appId: "1:890115125945:web:1208a4690cae6af4d9a168"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);