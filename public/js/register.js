document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const registerBtn = form.querySelector("button");
    registerBtn.disabled = true;

    message.style.color = "black";
    message.textContent = "Registering...";

    try {
      const res = await fetch("/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      registerBtn.disabled = false;

      if (!res.ok) {
        message.style.color = "red";
        message.textContent = data.message || "Register failed";
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username);

      message.style.color = "green";
      message.textContent = "Register successful! Redirecting...";

      setTimeout(() => {
        window.location.href = `/index.html`;
      }, 2000);
    } catch (err) {
      registerBtn.disabled = false;
      message.style.color = "red";
      message.textContent = "Error register.";
      console.error(err);
    }
  });
});
