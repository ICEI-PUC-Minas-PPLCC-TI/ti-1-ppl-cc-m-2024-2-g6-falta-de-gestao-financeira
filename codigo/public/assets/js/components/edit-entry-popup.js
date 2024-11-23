import entry from "../controllers/entry.js";

import { MILLISECCONDS_IN_DAY } from "../lib/constants.js";

import { updateEntriesList } from "./entries-list.js";
import { updateCategorySelect } from "./select-category.js";

export function editEntryPopup() {
  const editEntrieForm = document.getElementById("edit-entry-form");
  const editEntriePopup = document.getElementById("edit-entry-popup");
  const typeSelectors = document.querySelectorAll(
    "#edit-entry-form .form__field__tab__input"
  );

  const label = document.getElementById("edit-entry-form--label");
  const value = document.getElementById("edit-entry-form--value");
  const type = document.getElementById("edit-entry-form--income");
  const date = document.getElementById("edit-entry-form--date");
  const categoryId = document.getElementById("edit-entry-form--category");

  editEntrieForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      entryId: editEntrieForm.getAttribute("data-entry-id"),
      label: label.value,
      value: parseFloat(value.value),
      type: type.checked ? "income" : "expense",
      date: new Date(date.value).getTime() + MILLISECCONDS_IN_DAY,
      categoryId: parseInt(categoryId.value) || undefined,
    };

    const updatedEntrie = await entry.update(formData);

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
        "edit-entry-form--category",
        type.checked ? "icome" : "expense"
      );
    });
  });
}
