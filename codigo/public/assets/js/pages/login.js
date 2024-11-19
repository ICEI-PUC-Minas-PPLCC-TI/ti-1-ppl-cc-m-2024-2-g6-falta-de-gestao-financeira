import { loginForm } from "../components/login-form.js";
import { auth } from "../lib/auth.js";

const user = auth();

if (user) window.location.replace("/");

loginForm();
