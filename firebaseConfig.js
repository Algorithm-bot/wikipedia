import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCD4y2-uhps1KPwJQpbcLISnb-2vw9UZYY",
  authDomain: "wikipedia-2-df01c.firebaseapp.com",
  projectId: "wikipedia-2-df01c",
  storageBucket: "wikipedia-2-df01c.appspot.com",
  messagingSenderId: "275562490656",
  appId: "1:275562490656:android:af61c9577d41a04ebd0545",
};

// Initialize Firebase App (Only Once)
const app = initializeApp(firebaseConfig);

// Always use initializeAuth for persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };

