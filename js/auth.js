import { auth, db } from "./firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

console.log("Auth JS Loaded");

// =========================
// SIGNUP
// =========================

window.signup = async function () {

  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const confirmPassword = document.getElementById("confirmPassword")?.value.trim();
  const semester = document.getElementById("semester")?.value.trim();

  const role = localStorage.getItem("role") || "student";

  if (!name || !email || !password || !confirmPassword || !semester) {
    alert("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {

    const userCredential =
      await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      semester,
      role,
      createdAt: new Date().toISOString()
    });

    alert("Account Created Successfully ✅");

    window.location.href = "/login.html";

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

// =========================
// LOGIN (FIXED)
// =========================

async function login() {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email & password");
    return;
  }

  try {

    const userCredential =
      await signInWithEmailAndPassword(auth, email, password);

    const uid = userCredential.user.uid;

    const docSnap =
      await getDoc(doc(db, "users", uid));

    if (!docSnap.exists()) {
      alert("User not found");
      return;
    }

    const userData = docSnap.data();

    localStorage.setItem(
      "currentUser",
      JSON.stringify(userData)
    );

    alert("Login Successful ✅");

    setTimeout(() => {

      if (userData.role === "student") {
        window.location.href = "/student/dashboard.html";
      }

      else if (userData.role === "teacher") {
        window.location.href = "/teacher/dashboard.html";
      }

      else if (userData.role === "admin") {
        window.location.href = "/admin/dashboard.html";
      }

      else {
        alert("Invalid Role");
      }

    }, 300);

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}

// attach button safely
document.getElementById("loginBtn")?.addEventListener("click", login);

// =========================
// FORGOT PASSWORD
// =========================

window.resetPassword = async function () {

  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("Enter email first");
    return;
  }

  try {

    await sendPasswordResetEmail(auth, email);

    alert("Reset email sent ✅");

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

// =========================
// LOGOUT
// =========================

window.logout = async function () {

  await signOut(auth);

  localStorage.removeItem("currentUser");

  window.location.href = "/login.html";
};