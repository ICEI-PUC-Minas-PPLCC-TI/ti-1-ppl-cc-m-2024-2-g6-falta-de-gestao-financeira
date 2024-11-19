import entrie from "../controllers/entrie.js";
import { updateEntriesList } from "./entries-list.js";

export function createEntriePopup() {
  const createEntrieForm = document.getElementById("create-entrie-form");
  const createEntriePopup = document.getElementById("create-entrie-popup");

  const label = document.getElementById("create-entrie-form--label");
  const type = document.getElementById("create-entrie-form--income");
  const value = document.getElementById("create-entrie-form--value");
  const date = document.getElementById("create-entrie-form--date");
  const categoryId = document.getElementById("create-entrie-form--category");

  createEntrieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      categoryId: parseInt(categoryId.value),
      label: label.value,
      type: type.checked ? "income" : "expense",
      value: value.value,
      date: new Date(date.value).getTime(),
    };

    const newEntrie = await entrie.create(formData);

    if (!newEntrie) {
      alert("Erro ao criar o registro.");
      return;
    }

    createEntriePopup.close();
    createEntrieForm.reset();

    const updatedEntries = await entrie.getAllFromUser();

    updateEntriesList(updatedEntries);
  });
}
