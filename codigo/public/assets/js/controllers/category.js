import { TYPE_ENUM } from "../lib/constants.js";
import { auth } from "../lib/auth.js";

/*
  category: {
    id: number;
    ownerId: number;
    label: string;
    type: "income" | "expense";
    icon: string;
    createdAt: number;
    updatedAt: number
  }
*/

const category = {
  create: async ({ label, type, icon }) => {
    if (!label || !type) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    if (!TYPE_ENUM.includes(type)) {
      console.error(`Erro, tipo: "${type}" é inválido.`);
      return null;
    }

    const user = auth();

    if (!user) {
      console.error("Não autorizado.");
      return null;
    }

    const time = new Date().getTime();

    const res = await fetch("/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId: user.id,
        label,
        type,
        icon,
        createdAt: time,
        updatedAt: time,
      }),
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const category = await res.json();

    return category;
  },
  getById: async (categoryId) => {
    if (!categoryId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/categories/${categoryId}`);

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const category = await res.json();

    return category;
  },
  getAllFromUser: async () => {
    const user = auth();

    if (!user) {
      console.error("Não autorizado.");
      return null;
    }

    const res = await fetch(`/categories?ownerId=${user.id}`);

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const categories = await res.json();

    return categories;
  },
  update: async ({ categoryId, label, icon, type }) => {
    if (!categoryId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    if (type && !TYPE_ENUM.includes(type)) {
      console.error(`Erro, tipo: "${type}" é inválido.`);
      return null;
    }

    const res = await fetch(`/categories/${categoryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        label,
        type,
        icon,
        updatedAt: new Date().getTime(),
      }),
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const updatedCategory = await res.json();

    return updatedCategory;
  },
  delete: async (categoryId) => {
    if (!categoryId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/categories/${parseInt(categoryId)}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
    }

    return res.ok;
  },
};

export default category;
