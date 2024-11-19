import { login } from "../lib/auth.js";
import user from "../controllers/user.js";

export function loginForm() {
  const form = document.getElementById("login-form");

  const email = document.getElementById("email");
  const password = document.getElementById("password");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      email: email.value,
      password: password.value,
    };

    if (formData.name === "") {
      alert("Forneça um nome");
      return;
    }

    if (formData.password === "") {
      alert("Forneça uma senha");
      return;
    }

    const dbUser = await user.getByEmail(formData.email);

    if (!user) {
      alert("Usuário não encontrado");
      return;
    }

    if (dbUser.password !== formData.password) {
      alert("Senha incorreta");
      return;
    }

    login({ id: dbUser.id, name: dbUser.name, email: dbUser.email });
  });
}
