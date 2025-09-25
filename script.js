localStorage.setItem("user", JSON.stringify({
  username: "admin",
  password: "admin123"
}));

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const rememberCheckbox = document.getElementById("rememberMe");

  const rememberedUsername = localStorage.getItem("rememberedUsername");
  if (rememberedUsername) {
    usernameInput.value = rememberedUsername;
    rememberCheckbox.checked = true;
  }

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const user = JSON.parse(localStorage.getItem("user"));

    console.log("Stored user:", user);
    console.log("Input username:", username, "Input password:", password);

    if (username === user.username && password === user.password) {
      if (rememberCheckbox.checked) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid username or password");
    }
  });

  document.getElementById("forgotPasswordLink").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("forgotPasswordSection").style.display = "block";
  });

  document.getElementById("backToLogin").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("forgotPasswordSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
  });

  document.getElementById("resetPasswordBtn").addEventListener("click", function () {
    const resetUsername = document.getElementById("resetUsername").value.trim();
    const newPassword = document.getElementById("newPassword").value.trim();
    const user = JSON.parse(localStorage.getItem("user"));

    if (resetUsername === user.username) {
      if (newPassword.length < 4) {
        alert("Password must be at least 4 characters.");
        return;
      }

      user.password = newPassword;
      localStorage.setItem("user", JSON.stringify(user));

      alert("Password successfully reset!");
      document.getElementById("forgotPasswordSection").style.display = "none";
      document.getElementById("loginSection").style.display = "block";
    } else {
      alert("No account found with that username/email.");
    }
  });
});
