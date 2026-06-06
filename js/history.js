function loadHistory() {

  const table =
  document.getElementById("historyTable");

  let history =
  JSON.parse(
    localStorage.getItem("attendanceHistory")
  ) || [];

  if(history.length === 0){

    table.innerHTML = `
      <tr>
        <td colspan="3">
          No Attendance History Found
        </td>
      </tr>
    `;

    return;
  }

  history.forEach(record => {

    table.innerHTML += `
      <tr>
        <td>${record.date}</td>
        <td>${record.time}</td>
        <td>${record.status}</td>
      </tr>
    `;

  });

}

function goDashboard(){

  window.location.href =
  "dashboard.html";

}

loadHistory();