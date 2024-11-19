import { logoutButton } from "../components/logout-button.js";
import { auth } from "../lib/auth.js";

const user = auth();

if (!user) {
  window.location.replace("./login.html");
}

logoutButton();

// Código
