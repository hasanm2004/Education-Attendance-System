// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDsDupbf5RD_gCtjCAbS-VtIMbJwdynqcU",
  authDomain: "attendance-system-ae486.firebaseapp.com",
  projectId: "attendance-system-ae486",
  storageBucket: "attendance-system-ae486.firebasestorage.app",
  messagingSenderId: "444157672481",
  appId: "1:444157672481:web:af3f8c3f534d82ef733760"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);