function loadReport() {

let history =
JSON.parse(
localStorage.getItem("attendanceHistory")
) || [];

let total =
history.length;

let present =
history.filter(
item => item.status === "Present"
).length;

let percentage = 0;

if(total > 0){

percentage =
((present / total) * 100).toFixed(2);

}

document.getElementById(
"totalAttendance"
).innerText = total;

document.getElementById(
"presentDays"
).innerText = present;

document.getElementById(
"attendancePercentage"
).innerText = percentage + "%";

}

function downloadReport(){

let history =
JSON.parse(
localStorage.getItem("attendanceHistory")
) || [];

let reportText =
"STUDENT ATTENDANCE REPORT\n\n";

history.forEach((record,index)=>{

reportText +=
(index+1) +
". " +
record.date +
" | " +
record.time +
" | " +
record.status +
"\n";

});

let blob =
new Blob(
[reportText],
{type:"text/plain"}
);

let link =
document.createElement("a");

link.href =
URL.createObjectURL(blob);

link.download =
"Attendance_Report.txt";

link.click();

}

function goDashboard(){

window.location.href =
"dashboard.html";

}

loadReport();