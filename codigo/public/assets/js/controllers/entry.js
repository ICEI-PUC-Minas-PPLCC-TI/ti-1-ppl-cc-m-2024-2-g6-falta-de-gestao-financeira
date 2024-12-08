import { auth } from "../lib/auth.js";
import { MILLISECCONDS_IN_DAY, TYPE_ENUM } from "../lib/constants.js";

/*
  entry: {
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

const entry = {
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
        date: new Date(date).getTime() + MILLISECCONDS_IN_DAY,
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
  getById: async (entryId) => {
    if (!entryId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/entries/${entryId}`);

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const entry = await res.json();

    return entry;
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
  update: async ({ entryId, label, date, type, value, categoryId }) => {
    if (!entryId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    if (type && !TYPE_ENUM.includes(type)) {
      console.error(`Erro, tipo: "${type}" é inválido.`);
      return null;
    }

    const res = await fetch(`/entries/${entryId}`, {
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

    const updatedEntry = await res.json();

    return updatedEntry;
  },
  delete: async (entryId) => {
    if (!entryId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/entries/${entryId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
    }

    return res.ok;
  },
};

export default entry;
