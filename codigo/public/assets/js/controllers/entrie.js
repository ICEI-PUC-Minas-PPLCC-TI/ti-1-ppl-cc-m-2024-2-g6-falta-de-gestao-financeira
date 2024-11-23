import { auth } from "../lib/auth.js";
import { TYPE_ENUM } from "../lib/constants.js";

/*
  entrie: {
    id: number;
    ownerId: number;
    categoryId: number;
    label: string;
    type: "income" | "expense";
    date: number;
    value: number;
    createdAt: number;
    updatedAt: number;
  }
*/

const entrie = {
  create: async ({ label, type, value, date, categoryId }) => {
    if (!label || !type || !value || !date) {
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

    const res = await fetch("/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId: parseInt(user.id) || user.id,
        categoryId: parseInt(categoryId) || categoryId,
        label,
        type,
        value: parseFloat(value) || value,
        date: new Date(date).getTime(),
        createdAt: time,
        updatedAt: time,
      }),
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const newEntrie = await res.json();

    return newEntrie;
  },
  getById: async (entrieId) => {
    if (!entrieId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/entries/${entrieId}`);

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const entrie = await res.json();

    return entrie;
  },
  getAllFromUser: async () => {
    const user = auth();

    if (!user) {
      console.error("Não autorizado.");
      return null;
    }

    const res = await fetch(
      `/entries?ownerId=${user.id}&_sort=date&_order=desc`
    );

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const entries = await res.json();

    return entries;
  },
  update: async ({ entrieId, label, date, type, value, categoryId }) => {
    if (!entrieId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    if (type && !TYPE_ENUM.includes(type)) {
      console.error(`Erro, tipo: "${type}" é inválido.`);
      return null;
    }

    const res = await fetch(`/entries/${entrieId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: parseInt(categoryId) || categoryId,
        label,
        type,
        value: parseFloat(value) || value,
        date: new Date(date).getTime(),
        updatedAt: new Date().getTime(),
      }),
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const updatedEntrie = await res.json();

    return updatedEntrie;
  },
  delete: async (entrieId) => {
    if (!entrieId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/entries/${entrieId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
    }

    return res.ok;
  },
};

export default entrie;
