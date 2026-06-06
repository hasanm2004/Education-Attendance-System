const user =
JSON.parse(
localStorage.getItem("currentUser")
);

if(user){

document.getElementById("name").innerText =
user.name;

document.getElementById("email").innerText =
user.email;

document.getElementById("role").innerText =
user.role;

}