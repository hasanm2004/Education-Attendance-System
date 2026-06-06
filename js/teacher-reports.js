function loadTeacherReport(){

let history =
JSON.parse(
localStorage.getItem(
"attendanceHistory"
)
) || [];

let total =
history.length;

let present =
history.filter(
item=>item.status==="Present"
).length;

let absent =
total-present;

document.getElementById(
"totalAttendance"
).innerText=total;

document.getElementById(
"presentCount"
).innerText=present;

document.getElementById(
"absentCount"
).innerText=absent;

}

function downloadTeacherReport(){

let history =
JSON.parse(
localStorage.getItem(
"attendanceHistory"
)
) || [];

let text =
"TEACHER REPORT\n\n";

history.forEach((r,i)=>{

text +=
(i+1)+
" | "+
r.date+
" | "+
r.time+
" | "+
r.status+
"\n";

});

let blob =
new Blob(
[text],
{type:"text/plain"}
);

let link =
document.createElement("a");

link.href=
URL.createObjectURL(blob);

link.download=
"Teacher_Report.txt";

link.click();

}

loadTeacherReport();