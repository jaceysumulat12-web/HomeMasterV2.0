// --- Login handling ---
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe").checked;

  // --- Remember Me ---
  if (rememberMe) {
    localStorage.setItem("rememberedUser", username);
  } else {
    localStorage.removeItem("rememberedUser");
  }

  // Demo login check (replace with backend later)
  if (username === "admin" && password === "admin123") {
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } else {
    alert("Invalid username or password");
  }
});

// --- Autofill Remembered User ---
window.addEventListener("load", () => {
  const rememberedUser = localStorage.getItem("rememberedUser");
  if (rememberedUser) {
    document.getElementById("username").value = rememberedUser;
    document.getElementById("rememberMe").checked = true;
  }
});

// --- Forgot password toggle ---
const forgotPasswordLink = document.getElementById("forgotPasswordLink");
const backToLoginLink = document.getElementById("backToLogin");
const loginSection = document.getElementById("loginSection");
const forgotSection = document.getElementById("forgotPasswordSection");

forgotPasswordLink.addEventListener("click", function(e) {
  e.preventDefault();
  loginSection.style.display = "none";
  forgotSection.style.display = "block";
});

backToLoginLink.addEventListener("click", function(e) {
  e.preventDefault();
  forgotSection.style.display = "none";
  loginSection.style.display = "block";
});

// --- Reset password demo ---
document.getElementById("resetPasswordBtn").addEventListener("click", function() {
  const resetUser = document.getElementById("resetUsername").value;
  const newPass = document.getElementById("newPassword").value;

  if (resetUser && newPass) {
    alert("Password reset successful for: " + resetUser);
    forgotSection.style.display = "none";
    loginSection.style.display = "block";
  } else {
    alert("Please fill in all fields");
  }
});
