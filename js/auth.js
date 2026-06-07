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

console.log("Auth JS Loaded Successfully");

// =========================
// SIGNUP
// =========================

window.signup = async function () {

  const name = document.getElementById("name")?.value.trim();
  const seatNo =document.getElementById("seatNo").value.trim();
  const classYear = document.getElementById("classYear").value.trim();
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
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      name: name,
      seatNo: seatNo,
      classYear: classYear,
      email: email,
      semester: semester,
      role: role,
      createdAt: new Date().toISOString()
    });

    alert("Account Created Successfully ✅");

    window.location.href = "login.html";

  } catch (error) {

    console.error(error);
    alert(error.message);

  }
};

// =========================
// LOGIN
// =========================

window.login = async function () {

  const email =
    document.getElementById("email")?.value.trim();

  const password =
    document.getElementById("password")?.value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {

    const userCredential =
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

    const uid = userCredential.user.uid;

    const docSnap =
      await getDoc(
        doc(db, "users", uid)
      );

    if (!docSnap.exists()) {
      alert("User data not found");
      return;
    }

    const userData =
      docSnap.data();

    console.log("User Role:", userData.role);

    localStorage.setItem(
      "currentUser",
      JSON.stringify(userData)
    );

    alert("Login Successful ✅");

    // Role Based Redirect

    if (userData.role === "student") {

      window.location.href =
        "student/dashboard.html";

    }
    else if (userData.role === "teacher") {

      window.location.href =
        "teacher/dashboard.html";

    }
         else if (userData.role === "admin") {
    window.location.href = "/admin/dashboard.html";
}
    
    else {

      alert("Invalid Role Found");

    }

  } catch (error) {

    console.error(error);
    alert(error.message);

  }
};

// =========================
// FORGOT PASSWORD
// =========================

window.resetPassword = async function () {

  const email =
    document.getElementById("email")?.value.trim();

  if (!email) {
    alert("Enter email first");
    return;
  }

  try {

    await sendPasswordResetEmail(
      auth,
      email
    );

    alert("Password reset email sent ✅");

  } catch (error) {

    console.error(error);
    alert(error.message);

  }
};

// =========================
// LOGOUT
// =========================

window.logout = async function () {

  try {

    await signOut(auth);

    localStorage.removeItem("currentUser");

    window.location.href = "../login.html";

  } catch (error) {

    console.error(error);
    alert(error.message);

  }
};

// =========================
// BUTTON EVENTS
// =========================

document.addEventListener("DOMContentLoaded", () => {

  const signupBtn =
    document.getElementById("signupBtn");

  const loginBtn =
    document.getElementById("loginBtn");

  if (signupBtn) {
    signupBtn.addEventListener(
      "click",
      window.signup
    );
  }

  if (loginBtn) {
    loginBtn.addEventListener(
      "click",
      window.login
    );
  }

});