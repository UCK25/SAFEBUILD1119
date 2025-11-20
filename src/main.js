import { login, createGuestUser } from "./auth.js";

document.getElementById("btnLogin").addEventListener("click", async () => {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  let user = await login(u, p);

  if (!user) {
    // si no existe, crear invitado
    user = await createGuestUser(u);
  }

  if (!user) {
    document.getElementById("error").textContent = "Error al iniciar sesión.";
    return;
  }

  localStorage.setItem("user", JSON.stringify(user));
  window.location.href = "/app.html";  // tu página principal
});
