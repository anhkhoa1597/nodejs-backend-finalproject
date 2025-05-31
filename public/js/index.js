import checkAuth from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const registerBtn = document.getElementById("registerBtn");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const createPostBtn = document.getElementById("createPostBtn");
  const welcomeMessage = document.getElementById("welcomeMessage");

  if (registerBtn) registerBtn.addEventListener("click", redirectToRegister);
  if (loginBtn) loginBtn.addEventListener("click", redirectToLogin);
  if (logoutBtn) logoutBtn.addEventListener("click", logout);
  if (createPostBtn)
    createPostBtn.addEventListener("click", redirectToPostCreation);

  const data = await checkAuth();
  if (data) {
    if (registerBtn) registerBtn.style.display = "none";
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline-block";
    if (createPostBtn) createPostBtn.style.display = "inline-block";
    if (welcomeMessage)
      welcomeMessage.innerText = `Welcome, ${data.user.username}!`;
  } else {
    if (registerBtn) registerBtn.style.display = "inline-block";
    if (loginBtn) loginBtn.style.display = "inline-block";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (createPostBtn) createPostBtn.style.display = "none";
  }
});

const redirectToRegister = () => {
  window.location.href = "/register";
};

const redirectToLogin = () => {
  window.location.href = "/login";
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  window.location.href = "/login";
};

const redirectToPostCreation = () => {
  window.location.href = "/post";
};
