import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase project configuration (Replace with your actual credentials)
const firebaseConfig = {
  apiKey: "AIzaSyAp3JH3PMBTXKaAe6rrAF2Lkdb0gVpljgc",
  authDomain: "wikipedia-a945e.firebaseapp.com",
  projectId: "wikipedia-a945e",
  storageBucket: "wikipedia-a945e.appspot.com",
  messagingSenderId: "313601692464",
  appId: "1:313601692464:android:256e6b39ada40cd493aef5",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };