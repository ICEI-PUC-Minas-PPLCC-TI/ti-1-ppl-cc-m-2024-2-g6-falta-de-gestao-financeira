import { login } from "../lib/auth.js";
import user from "../controllers/user.js";

export function registerForm() {
  const form = document.getElementById("register-form");

  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      name: name.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    };

    if (formData.name === "") {
      alert("Forneça um nome");
      return;
    }

    if (formData.email === "") {
      alert("Forneça um email");
      return;
    }

    if (formData.password === "") {
      alert("Forneça uma senha");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("As senhas precisão ser iguais");
      return;
    }

    const newUser = await user.create({
      email: formData.email,
      name: formData.name,
      password: formData.password,
    });

    if (!newUser) {
      alert("Erro interno ao criar usuário, tente novamente");
      return;
    }

    login({ id: newUser.id, name: newUser.name, email: newUser.email });
  });
}
