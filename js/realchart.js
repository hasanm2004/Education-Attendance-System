window.loadAdminChart = async function () {

  const q = query(collection(db, "attendance"));
  const snapshot = await getDocs(q);

  let present = 0;
  let late = 0;

  snapshot.forEach(doc => {
    const data = doc.data();
    if (data.status === "Present") present++;
    else if (data.status === "Late") late++;
  });

  const ctx = document.getElementById("adminChart");

  if (!ctx) return;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Present", "Late"],
      datasets: [{
        label: "Attendance Stats",
        data: [present, late]
      }]
    }
  });

};


window.downloadReport = function () {

  let history = JSON.parse(
    localStorage.getItem("attendanceHistory")
  ) || [];

  if (history.length === 0) {
    alert("No Data Found");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("ATTENDANCE REPORT", 20, 20);

  let y = 40;

  history.forEach((item, index) => {

    doc.text(
      `${index + 1}. ${item.studentName} | ${item.date} | ${item.status}`,
      20,
      y
    );

    y += 10;
  });

  doc.save("Attendance_Report.pdf");
};

window.searchAttendance = function () {

  let input =
    document.getElementById("search").value.toLowerCase();

  let cards =
    document.querySelectorAll(".card");

  cards.forEach(card => {

    let text = card.innerText.toLowerCase();

    if (text.includes(input)) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }

  });

};

window.exportExcel = function () {

  let history = JSON.parse(
    localStorage.getItem("attendanceHistory")
  ) || [];

  let csv =
    "Name,Email,Semester,Status,Date,Time\n";

  history.forEach(item => {

    csv += `${item.studentName},${item.email},${item.semester},${item.status},${item.date},${item.time}\n`;

  });

  let blob = new Blob([csv], {
    type: "text/csv"
  });

  let link = document.createElement("a");

  link.href = URL.createObjectURL(blob);

  link.download = "attendance.csv";

  link.click();

};

document.querySelectorAll(".card").forEach(card => {

  card.style.padding = "15px";
  card.style.margin = "10px";
  card.style.borderRadius = "12px";
  card.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
  card.style.transition = "0.3s";

  card.addEventListener("mouseover", () => {
    card.style.transform = "scale(1.02)";
  });

  card.addEventListener("mouseout", () => {
    card.style.transform = "scale(1)";
  });

});