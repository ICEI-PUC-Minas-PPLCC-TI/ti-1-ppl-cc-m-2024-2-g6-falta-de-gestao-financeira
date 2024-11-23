import { auth } from "../lib/auth.js";
import { TIME_ENUM, TYPE_ENUM } from "../lib/constants.js";

/*
  goal: {
    id: number;
    ownerId: number;
    categoryId: number;
    label: string;
    type: "income" | "expense";
    value: number;
    time: "daily" | "weakly" | "montly"  | "yearly";
    createdAt: number;
    updatedAt: number;
  }
*/

const goal = {
  create: async ({ categoryId, label, type, value, time }) => {
    if (!categoryId || !label || !type || !value || !time) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    if (!TYPE_ENUM.includes(type)) {
      console.error(`Erro, tipo: "${type}" é inválido.`);
      return null;
    }

    if (!TIME_ENUM.includes(time)) {
      console.error(`Erro, tempo: "${time}" é inválido.`);
      return null;
    }

    const user = auth();

    if (!user) {
      console.error("Não autorizado.");
      return null;
    }

    const createdAt = new Date().getTime();

    const res = await fetch("/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ownerId: parseInt(user.id) || user.id,
        categoryId: parseInt(categoryId) || categoryId,
        label,
        type,
        value: parseFloat(value) || value,
        time,
        createdAt,
        updatedAt: createdAt,
      }),
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const goal = await res.json();

    return goal;
  },
  getById: async (goalId) => {
    if (!goalId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/goals/${goalId}`);

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const goal = await res.json();

    return goal;
  },
  getAllFromUser: async () => {
    const user = auth();

    if (!user) {
      console.error("Não autorizado.");
      return null;
    }

    const res = await fetch(`/goals?ownerId=${user.id}`);

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const goals = await res.json();

    return goals;
  },
  update: async ({ goalId, categoryId, label, type, value, time }) => {
    if (!goalId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    if (type && !TYPE_ENUM.includes(type)) {
      console.error(`Erro, tipo: "${type}" é inválido.`);
      return null;
    }

    if (time && !TIME_ENUM.includes(time)) {
      console.error(`Erro, tempo: "${time}" é inválido.`);
      return null;
    }

    const res = await fetch(`/goals/${goalId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: parseInt(categoryId) || categoryId,
        label,
        type,
        value: parseFloat(value) || value,
        time,
        updatedAt: new Date().getTime(),
      }),
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const updatedGoal = await res.json();

    return updatedGoal;
  },
  delete: async (goalId) => {
    if (!goalId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const res = await fetch(`/goals/${goalId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
    }

    return res.ok;
  },
};

export default goal;
