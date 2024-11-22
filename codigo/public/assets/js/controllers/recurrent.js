import { auth } from "../lib/auth.js";
import { TYPE_ENUM } from "../lib/constants.js";

/*
  recurrent: {
    id: number;
    ownerId: number;
    categoryId: number;
    label: string;
    type: "income" | "expense";
    frequency: number;
    initialDate: number;
    finalDate: number;
    value: number;
    createdAt: number;
    updatedAt: number;
  }
*/

const recurrent = {
  create: async ({
    categoryId,
    label,
    type,
    frequency,
    initialDate,
    finalDate,
    value,
  }) => {
    if (!label || !type || !frequency || !initialDate || !finalDate || !value) {
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

    const res = await fetch("/recurring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId: user.id,
        categoryId,
        label,
        type,
        frequency,
        initialDate,
        finalDate,
        value,
        updatedAt: time,
        createdAt: time,
      }),
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const newRecurrent = await res.json();

    return newRecurrent;
  },
  getById: async (recurrentId) => {
    if (!recurrentId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/recurring/${recurrentId}`);

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const recurrent = await res.json();

    return recurrent;
  },
  getAllFromUser: async () => {
    const user = auth();

    if (!user) {
      console.error("Não autorizado.");
      return null;
    }

    const res = await fetch(`/recurring?ownerId=${user.id}`);

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const recurring = await res.json();

    return recurring;
  },
  update: async ({
    recurrentId,
    categoryId,
    label,
    type,
    frequency,
    initialDate,
    finalDate,
    value,
  }) => {
    if (!recurrentId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    if (type && !TYPE_ENUM.includes(type)) {
      console.error(`Erro, tipo: "${type}" é inválido.`);
      return null;
    }

    const res = await fetch(`/recurring/${recurrentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId,
        label,
        type,
        frequency,
        initialDate,
        finalDate,
        value,
        updatedAt: new Date().getTime(),
      }),
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const updatedRecurrent = await res.json();

    return updatedRecurrent;
  },
  delete: async (recurrentId) => {
    if (!recurrentId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/recurring/${recurrentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
    }

    return res.ok;
  },
};

export default recurrent;
