import { registerForm } from "../components/register-form.js";
import { auth } from "../lib/auth.js";

const user = auth();

if (user) window.location.replace("/");

registerForm();
