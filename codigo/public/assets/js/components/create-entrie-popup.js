import entrie from "../controllers/entrie.js";

import { updateEntriesList } from "./entries-list.js";
import { updateCategorySelect } from "./select-category.js";

export function createEntriePopup() {
  const createEntrieForm = document.getElementById("create-entrie-form");
  const createEntriePopup = document.getElementById("create-entrie-popup");
  const typeSelectors = document.querySelectorAll(
    "#create-entrie-form .form__field__tab__input"
  );

  const label = document.getElementById("create-entrie-form--label");
  const type = document.getElementById("create-entrie-form--income");
  const value = document.getElementById("create-entrie-form--value");
  const date = document.getElementById("create-entrie-form--date");
  const categoryId = document.getElementById("create-entrie-form--category");

  createEntrieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      categoryId: parseInt(categoryId.value) || undefined,
      label: label.value,
      type: type.checked ? "income" : "expense",
      value: parseFloat(value.value),
      date: new Date(date.value).getTime(),
    };

    const newEntrie = await entrie.create(formData);

    if (!newEntrie) {
      alert("Erro ao criar o registro.");
      return;
    }

    createEntriePopup.close();
    createEntrieForm.reset();

    updateEntriesList();
  });

  typeSelectors.forEach((input) => {
    input.addEventListener("change", () => {
      updateCategorySelect(
        "create-entrie-form--category",
        type.checked ? "income" : "expense"
      );
    });
  });

  updateCategorySelect("create-entrie-form--category", "income");
}
