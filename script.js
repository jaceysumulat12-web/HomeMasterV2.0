document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Demo login check (you can replace this with backend auth later)
  if (username === "admin" && password === "admin123") {
    alert("Login successful!");
    // Redirect to dashboard page
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password");
  }
});
