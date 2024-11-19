import { logout } from "../lib/auth.js";

export function logoutButton() {
  const logoutButton = document.getElementById("logout-button");

  logoutButton.addEventListener("click", (event) => {
    event.preventDefault();

    logout();
  });
}
