import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDBIkfdYy5vGg4e71sKAPABXkseMYegkzI",
  authDomain: "shinkama-project.firebaseapp.com",
  projectId: "shinkama-project",
  storageBucket: "shinkama-project.appspot.com",
  messagingSenderId: "421321926074",
  appId: "1:421321926074:web:eb0e0adb255ae2fc6c6983",
  measurementId: "G-DG55YPJ2T9",
};

let analytics;
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

export { auth, provider, analytics };
