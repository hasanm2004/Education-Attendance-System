import { db } from "./firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.loadAttendance = async function () {

  const tbody =
    document.getElementById("attendanceBody");

  tbody.innerHTML = "";

  const querySnapshot =
    await getDocs(
      collection(db, "attendance")
    );

  querySnapshot.forEach((doc) => {

    const data = doc.data();

    tbody.innerHTML += `
      <tr>
        <td>${data.studentName}</td>
        <td>${data.studentEmail}</td>
        <td>${data.semester}</td>
        <td>${data.status}</td>
        <td>${data.date}</td>
      </tr>
    `;

  });

};