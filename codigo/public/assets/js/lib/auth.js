export function auth() {
  const data = sessionStorage.getItem("user");
  const parsedData = JSON.parse(data);

  if (!parsedData) return null;

  return parsedData;
}

export function login({ id, name, email }) {
  sessionStorage.setItem("user", JSON.stringify({ id, name, email }));
  window.location.replace("/");
}

export function logout() {
  sessionStorage.removeItem("user");
  window.location.replace("/");
}
