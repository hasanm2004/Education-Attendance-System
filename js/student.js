import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =========================
// WELCOME USER
// =========================

let user = JSON.parse(
  localStorage.getItem("currentUser")
);

if (user && document.getElementById("welcome")) {
  document.getElementById("welcome").innerText =
    "Welcome " + user.name;
}

// =========================
// LOAD HISTORY
// =========================

window.loadHistory = async function () {

  const user =
    JSON.parse(
      localStorage.getItem("currentUser")
    );

  const historyContainer =
    document.getElementById("history");

  if (!historyContainer) return;

  historyContainer.innerHTML = "";

  const q = query(
    collection(db, "attendance"),
    where("email", "==", user.email)
  );

  const snapshot = await getDocs(q);

  snapshot.forEach((doc) => {

    const data = doc.data();

    historyContainer.innerHTML += `
      <div class="card">
        <p>Status: ${data.status}</p>
      </div>
    `;

  });

};

// =========================
// GPS ATTENDANCE
// =========================

window.markAttendance = async function () {

  if (!navigator.geolocation) {
    alert("GPS not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async function (position) {

      let lat = position.coords.latitude;
      let lng = position.coords.longitude;

      let uniLat = 24.9420;
      let uniLng = 67.1147;

      let distance =
        getDistance(lat, lng, uniLat, uniLng);

      if (distance > 0.5) {

        document.getElementById("status").innerText =
          "❌ Outside Campus";

        return;
      }

      try {

        const user =
          JSON.parse(
            localStorage.getItem("currentUser")
          );

        await addDoc(
          collection(db, "attendance"),
          {
            studentName: user.name,
            email: user.email,
            semester: user.semester,
            latitude: lat,
            longitude: lng,
            status: "Present",
            timestamp: serverTimestamp()
          }
        );

        const record = {
          studentName: user.name,
          email: user.email,
          semester: user.semester,
          status: "Present",
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString()
        };

        let history =
          JSON.parse(
            localStorage.getItem("attendanceHistory")
          ) || [];
              
               let hour = new Date().getHours();

               let status = "Present";

               if (hour >= 9) {
                status = "Late";
                 }


        history.push(record);

        localStorage.setItem(
          "attendanceHistory",
          JSON.stringify(history)
        );

        document.getElementById("status").innerText =
          "✅ Attendance Marked";

        document.getElementById("locationStatus").innerText =
          "Campus Verified";

        alert("Attendance Saved Successfully");

      } catch (error) {

        console.error(error);
        alert(error.message);

      }

    }
  );

};

// =========================
// ATTENDANCE PERCENTAGE
// =========================

window.calculateAttendance = async function () {

  const user =
    JSON.parse(
      localStorage.getItem("currentUser")
    );

  const q = query(
    collection(db, "attendance"),
    where("email", "==", user.email)
  );

  const snapshot = await getDocs(q);

  const presentDays = snapshot.size;

  const totalClasses = 30;

  const percentage =
    ((presentDays / totalClasses) * 100)
    .toFixed(2);

  if (document.getElementById("percentage")) {

    document.getElementById("percentage")
      .innerText =
      "Attendance: " + percentage + "%";

  }

};

// =========================
// PDF REPORT
// =========================

window.generatePDF = function () {

  let history =
    JSON.parse(
      localStorage.getItem("attendanceHistory")
    ) || [];

  if (history.length === 0) {
    alert("No attendance found");
    return;
  }

  let data =
    history[history.length - 1];

  let text =
    "ATTENDANCE REPORT\n\n" +
    "Date: " + data.date + "\n" +
    "Time: " + data.time + "\n" +
    "Status: " + data.status;

  let blob =
    new Blob([text], {
      type: "text/plain"
    });

  let link =
    document.createElement("a");

  link.href =
    URL.createObjectURL(blob);

  link.download =
    "attendance_report.txt";

  link.click();

};

// =========================
// CHART
// =========================

const ctx =
  document.getElementById("chart");

if (ctx) {

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: [
        "Present",
        "Absent"
      ],
      datasets: [{
        data: [80, 20]
      }]
    }
  });

}

// =========================
// DISTANCE FUNCTION
// =========================

function getDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371;

  let dLat =
    (lat2 - lat1) *
    Math.PI / 180;

  let dLon =
    (lon2 - lon1) *
    Math.PI / 180;

  let a =
    Math.sin(dLat / 2) *
    Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  let c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return R * c;

}

// =========================
// CAMERA
// =========================

const video =
  document.getElementById("video");

if (video) {

  navigator.mediaDevices
    .getUserMedia({
      video: true
    })
    .then(function (stream) {

      video.srcObject =
        stream;

    })
    .catch(function (err) {

      console.log(
        "Camera error:",
        err
      );

    });

}

window.captureFace = function () {

  alert(
    "Face Captured ✔ (Demo Mode)"
  );

};

// =========================
// LOGOUT
// =========================

window.logout = function () {

  localStorage.removeItem(
    "currentUser"
  );

  window.location.href =
    "../login.html";

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