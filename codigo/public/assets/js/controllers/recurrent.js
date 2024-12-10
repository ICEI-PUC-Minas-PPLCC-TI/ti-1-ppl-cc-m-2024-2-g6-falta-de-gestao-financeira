import entry from "./entry.js";

import { auth } from "../lib/auth.js";
import { MILLISECCONDS_IN_DAY, TYPE_ENUM } from "../lib/constants.js";
import { daysDiffrence } from "../lib/util.js";

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
        ownerId: parseInt(user.id) || user.id,
        categoryId: parseInt(categoryId) || categoryId,
        label,
        type,
        frequency: parseInt(frequency) || frequency,
        initialDate: new Date(initialDate).getTime() + MILLISECCONDS_IN_DAY,
        finalDate: new Date(finalDate).getTime() + MILLISECCONDS_IN_DAY,
        value: parseFloat(value) || value,
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

    const oldRecurrent = await recurrent.getById(recurrentId);

    if (!oldRecurrent) {
      console.error(`Erro, recorrente não encontrado.`);
      return null;
    }

    const res = await fetch(`/recurring/${recurrentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: parseInt(categoryId) || categoryId,
        label,
        type,
        value: parseFloat(value) || value,
        frequency: parseInt(frequency) || frequency,
        initialDate: new Date(initialDate).getTime(),
        finalDate: new Date(finalDate).getTime(),
        updatedAt: new Date().getTime(),
      }),
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
      return null;
    }

    const updatedRecurrent = await res.json();

    await deleteOldRecurrentEntries(oldRecurrent);

    return updatedRecurrent;
  },
  delete: async (recurrentId) => {
    if (!recurrentId) {
      console.error("Campos obrigatórios não enviados.");
      return null;
    }

    const oldRecurrent = await recurrent.getById(recurrentId);

    if (!oldRecurrent) {
      console.error(`Erro, recorrente não encontrado.`);
      return null;
    }

    const res = await fetch(`/recurring/${recurrentId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      console.error("Erro Interno do JSON Server.");
    } else {
      await deleteOldRecurrentEntries(oldRecurrent);
    }

    return res.ok;
  },
};

export async function deleteOldRecurrentEntries(oldRecurrent) {
  const entries = await entry.getAllFromUser();

  for (const { id, categoryId, label, type, value } of entries) {
    if (
      oldRecurrent.categoryId === categoryId &&
      oldRecurrent.label === label &&
      oldRecurrent.type === type &&
      oldRecurrent.value === value
    ) {
      await entry.delete(id);
    }
  }
}

export async function insertMissingRecurringEntries() {
  const recurring = await recurrent.getAllFromUser();

  const entries = await entry.getAllFromUser();

  const today = new Date().getTime() + MILLISECCONDS_IN_DAY;

  for (const {
    initialDate,
    finalDate,
    frequency,
    label,
    type,
    value,
    categoryId,
  } of recurring) {
    const timeSpan = daysDiffrence(Math.min(finalDate, today), initialDate);

    let insertDay = Math.floor(timeSpan / frequency) * frequency;

    if (entries.length < 1) {
      while (insertDay >= 0) {
        await entry.create({
          categoryId,
          label,
          type,
          value,
          date: initialDate + insertDay * MILLISECCONDS_IN_DAY,
        });

        insertDay -= frequency;
      }
    } else {
      let i = 0;

      if (new Date(today).getMonth() === new Date(finalDate).getMonth()) return;

      while (i < entries.length) {
        const timeSpanFromStart = daysDiffrence(entries[i].date, initialDate);

        while (timeSpanFromStart < insertDay && insertDay >= 0) {
          await entry.create({
            categoryId,
            label,
            type,
            value,
            date: initialDate + insertDay * MILLISECCONDS_IN_DAY,
          });

          insertDay -= frequency;
        }

        if (timeSpanFromStart === insertDay) {
          const currentDate = entries[i].date;
          let create = true;

          while (
            create &&
            i < entries.length &&
            entries[i].date === currentDate
          ) {
            if (
              categoryId === entries[i].categoryId &&
              label === entries[i].label &&
              type === entries[i].type &&
              value === entries[i].value
            ) {
              create = false;
            } else i++;
          }

          if (create) {
            await entry.create({
              categoryId,
              label,
              type,
              value,
              date: initialDate + insertDay * MILLISECCONDS_IN_DAY,
            });

            i--;
          }

          insertDay -= frequency;
        }

        i++;
      }
    }
  }
}

export default recurrent;
