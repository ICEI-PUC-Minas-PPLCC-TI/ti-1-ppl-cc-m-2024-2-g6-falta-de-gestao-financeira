import entrie from "../controllers/entrie.js";

import { MILLISECCONDS_IN_DAY } from "../lib/constants.js";

import { updateEntriesList } from "./entries-list.js";
import { updateCategorySelect } from "./select-category.js";

export function editEntriePopup() {
  const editEntrieForm = document.getElementById("edit-entrie-form");
  const editEntriePopup = document.getElementById("edit-entrie-popup");
  const typeSelectors = document.querySelectorAll(
    "#edit-entrie-form .form__field__tab__input"
  );

  const label = document.getElementById("edit-entrie-form--label");
  const value = document.getElementById("edit-entrie-form--value");
  const type = document.getElementById("edit-entrie-form--income");
  const date = document.getElementById("edit-entrie-form--date");
  const categoryId = document.getElementById("edit-entrie-form--category");

  editEntrieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      entrieId: editEntrieForm.getAttribute("data-entrie-id"),
      label: label.value,
      value: parseInt(value.value),
      type: type.checked ? "income" : "expense",
      date: new Date(date.value).getTime() + MILLISECCONDS_IN_DAY,
      categoryId: parseInt(categoryId.value) || undefined,
    };

    const updatedEntrie = await entrie.update(formData);

    if (!updatedEntrie) {
      alert("Erro ao editar o registro.");
      return;
    }

    editEntriePopup.close();
    editEntrieForm.reset();

    updateEntriesList();
  });

  typeSelectors.forEach((input) => {
    input.addEventListener("change", () => {
      updateCategorySelect(
        "edit-entrie-form--category",
        type.checked ? "icome" : "expense"
      );
    });
  });
}
