function loadAttendance() {

  const table =
    document.getElementById("attendanceTable");

  const attendance =
    JSON.parse(localStorage.getItem("attendance"));

  if (!attendance) {

    table.innerHTML = `
      <tr>
        <td colspan="3">
          No Attendance Found
        </td>
      </tr>
    `;

    return;
  }

  table.innerHTML = `
    <tr>
      <td>${attendance.date}</td>
      <td>${attendance.time}</td>
      <td>${attendance.status}</td>
    </tr>
  `;

}

function goDashboard() {

  window.location.href =
    "dashboard.html";

}

loadAttendance();