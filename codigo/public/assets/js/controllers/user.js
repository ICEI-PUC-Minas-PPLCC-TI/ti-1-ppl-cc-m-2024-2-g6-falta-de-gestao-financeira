/*
  user: {
    id: number;
    name: string;
    email: string;
    password: string;
    createdAt: number;
    updatedAt: number;
  }
*/

const user = {
  create: async ({ name, password, email }) => {
    if (!name || !password || !email) {
      console.error("Campos obrigatórios não enviados.");
      alert("Campos obrigatórios não enviados.");
      return null;
    }

    const userWithEmail = await user.getByEmail(email);

    if (userWithEmail) {
      console.error("Email já cadastrado.");
      alert("Email já cadastrado.");
      return null;
    }

    const time = new Date().getTime();

    const res = await fetch("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        createdAt: time,
        updatedAt: time,
      }),
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      alert("Erro ao criar o usuário.");
      return null;
    }

    const newUser = await res.json();

    return newUser;
  },
  getById: async (userId) => {
    if (!userId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/users/${userId}`);

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const users = await res.json();

    return users;
  },
  getAll: async () => {
    const res = await fetch("/users");

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const users = await res.json();

    return users;
  },
  getByEmail: async (email) => {
    if (!email) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/users?email=${email}`);

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return false;
    }

    const users = await res.json();

    if (users.lenght < 1) return null;

    return users[0];
  },
  update: async ({ userId, name, password, email }) => {
    if (!userId) {
      console.error("Campos obrigatórios não enviados.");
      alert("Campos obrigatórios não enviados.");
      return null;
    }

    const update = {
      name,
      updatedAt: new Date().getTime(),
      password,
    };

    if (email) {
      const userWithEmail = await user.getByEmail(email);

      if (userWithEmail) {
        update.email = email;
      } else {
        console.error("Email já cadastrado.");
        alert("Email já cadastrado.");

        return null;
      }
    }

    const res = await fetch(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(update),
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const updatedUser = await res.json();

    return updatedUser;
  },
  delete: async (userId) => {
    if (!userId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/users/${userId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
    }

    return res.ok;
  },
};

export default user;
