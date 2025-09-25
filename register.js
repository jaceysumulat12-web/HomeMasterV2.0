document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const positionInput = document.getElementById("position");
  const passwordInput = document.getElementById("password");
  const rememberCheckbox = document.getElementById("rememberMe");

  const rememberedUser  = JSON.parse(localStorage.getItem("rememberedUser "));
  if (rememberedUser ) {
    usernameInput.value = rememberedUser .name || "";
    emailInput.value = rememberedUser .email || "";
    positionInput.value = rememberedUser .position || "";
    passwordInput.value = rememberedUser .password || "";
    rememberCheckbox.checked = true;
  }

  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    let user = {
      name: usernameInput.value,
      email: emailInput.value,
      position: positionInput.value,
      password: passwordInput.value
    };

    localStorage.setItem("userData", JSON.stringify(user));

    if (rememberCheckbox.checked) {
      localStorage.setItem("rememberedUser ", JSON.stringify(user));
    } else {
      localStorage.removeItem("rememberedUser ");
    }

    alert("Registration successful! 🎉");
    window.location.href = "dashboard.html";
  });
});