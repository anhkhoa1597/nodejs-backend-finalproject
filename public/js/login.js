document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const loginBtn = form.querySelector("button");
    loginBtn.disabled = true;

    message.style.color = "black";
    message.textContent = "Logging in...";

    try {
      const res = await fetch("/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      loginBtn.disabled = false;

      if (!res.ok) {
        message.style.color = "red";
        message.textContent = data.message || "Login failed";
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);

      message.style.color = "green";
      message.textContent = "Login successful! Redirecting...";

      setTimeout(() => {
        window.location.href = `/index.html`;
      }, 2000);
    } catch (err) {
      loginBtn.disabled = false;
      message.style.color = "red";
      message.textContent = "Error logging in.";
      console.error(err);
    }
  });
});
