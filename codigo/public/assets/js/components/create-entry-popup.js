import entry from "../controllers/entry.js";

import { updateEntriesList } from "./entries-list.js";
import { updateCategorySelect } from "./select-category.js";

export function createEntryPopup() {
  const createEntryForm = document.getElementById("create-entry-form");
  const createEntryPopup = document.getElementById("create-entry-popup");
  const typeSelectors = document.querySelectorAll(
    "#create-entry-form .form__field__tab__input"
  );

  const label = document.getElementById("create-entry-form--label");
  const type = document.getElementById("create-entry-form--income");
  const value = document.getElementById("create-entry-form--value");
  const date = document.getElementById("create-entry-form--date");
  const categoryId = document.getElementById("create-entry-form--category");

  createEntryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      categoryId: parseInt(categoryId.value) || undefined,
      label: label.value,
      type: type.checked ? "income" : "expense",
      value: parseFloat(value.value),
      date: new Date(date.value).getTime(),
    };

    const newEntry = await entry.create(formData);

    if (!newEntry) {
      alert("Erro ao criar o registro.");
      return;
    }

    createEntryPopup.close();
    createEntryForm.reset();

    updateEntriesList();
  });

  typeSelectors.forEach((input) => {
    input.addEventListener("change", () => {
      updateCategorySelect(
        "create-entry-form--category",
        type.checked ? "income" : "expense"
      );
    });
  });

  updateCategorySelect("create-entry-form--category", "income");
}
