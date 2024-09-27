// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDU_g9o22rgRz9o4sn-4asE7wlGsr3Cqko",
  authDomain: "the-craftly-shop-24da0.firebaseapp.com",
  projectId: "the-craftly-shop-24da0",
  storageBucket: "the-craftly-shop-24da0.appspot.com",
  messagingSenderId: "167864820853",
  appId: "1:167864820853:web:9506b7a3782cd0d956c43c",
  measurementId: "G-66VMC6LCDZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default storage;
