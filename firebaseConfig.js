import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase project configuration (Replace with your actual credentials)
const firebaseConfig = {
 apiKey: "AIzaSyCD4y2-uhps1KPwJQpbcLISnb-2vw9UZYY",
  authDomain: "wikipedia-2-df01c.firebaseapp.com",
  projectId: "wikipedia-2-df01c",
  storageBucket: "wikipedia-2-df01c.appspot.com",
  messagingSenderId: "275562490656",
  appId: "1:275562490656:android:af61c9577d41a04ebd0545",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth }


