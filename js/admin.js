import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onSnapshot,
  collection
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onSnapshot(collection(db, "attendance"), (snapshot) => {

  document.getElementById("attendanceCount").innerText =
    snapshot.size;

});

window.onload = async function () {

  await loadStats();

};

async function loadStats() {

  let students = 0;
  let teachers = 0;

  const usersSnapshot =
    await getDocs(
      collection(db, "users")
    );

  usersSnapshot.forEach((doc) => {

    const user = doc.data();

    if (user.role === "student") {

      students++;

    } else if (user.role === "teacher") {

      teachers++;

    }

  });

  document.getElementById("studentCount")
    .innerText = students;

  document.getElementById("teacherCount")
    .innerText = teachers;

  const attendanceSnapshot =
    await getDocs(
      collection(db, "attendance")
    );

  document.getElementById("attendanceCount")
    .innerText =
    attendanceSnapshot.size;

  createChart(
    attendanceSnapshot.size
  );

}

function createChart(attendance) {

  const ctx =
    document.getElementById(
      "attendanceChart"
    );

  new Chart(ctx, {

    type: "bar",

    data: {

      labels: [
        "Attendance Records"
      ],

      datasets: [{

        label: "Records",

        data: [attendance]

      }]

    }

  });

}

window.logout = function () {

  localStorage.clear();

  window.location.href =
    "login.html";

};

window.downloadPDF = function () {

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Attendance Report", 20, 20);

  let user = JSON.parse(localStorage.getItem("currentUser"));

  doc.text("Name: " + user.name, 20, 40);
  doc.text("Email: " + user.email, 20, 50);

  doc.save("report.pdf");
};

window.searchUser = async function () {

  let input = document.getElementById("search").value.toLowerCase();

  const snapshot = await getDocs(collection(db, "users"));

  let results = document.getElementById("results");
  results.innerHTML = "";

  snapshot.forEach(doc => {

    let user = doc.data();

    if (user.name.toLowerCase().includes(input)) {

      results.innerHTML += `
        <div class="card">
          <p>${user.name}</p>
          <p>${user.email}</p>
          <p>${user.role}</p>
        </div>
      `;

    }

  });

};

window.exportCSV = async function () {

  const snapshot = await getDocs(collection(db, "attendance"));

  let csv = "Name,Email,Status\n";

  snapshot.forEach(doc => {

    let d = doc.data();
    csv += `${d.studentName},${d.email},${d.status}\n`;

  });

  let blob = new Blob([csv], { type: "text/csv" });

  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "attendance.csv";
  link.click();
};

import { requireRole } from "../authGuard.js";

requireRole("admin");

function getMonthlyData(snapshot) {

  let data = {};

  snapshot.forEach(doc => {

    let date = doc.data().timestamp?.toDate?.();

    if (!date) return;

    let month = date.getMonth();

    data[month] = (data[month] || 0) + 1;

  });

  return data;
}