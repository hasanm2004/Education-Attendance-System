let user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  window.location.href = "../login.html";
}

export function requireRole(role) {
  if (user.role !== role) {
    alert("Access Denied");
    window.location.href = "../login.html";
  }
}