function loadAttendance(){

const tbody =
document.getElementById(
"attendanceBody"
);

let history =
JSON.parse(
localStorage.getItem(
"attendanceHistory"
)
) || [];

if(history.length===0){

tbody.innerHTML=`
<tr>
<td colspan="3">
No Attendance Found
</td>
</tr>
`;

return;

}

history.forEach(record=>{

tbody.innerHTML += `
<tr>
<td>${record.date}</td>
<td>${record.time}</td>
<td>${record.status}</td>
</tr>
`;

});

}

loadAttendance();