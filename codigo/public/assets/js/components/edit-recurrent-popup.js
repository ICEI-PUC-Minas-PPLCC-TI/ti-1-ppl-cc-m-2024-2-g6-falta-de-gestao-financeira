import recurrent from "../controllers/recurrent.js";

import { MILLISECCONDS_IN_DAY } from "../lib/constants.js";

import { updateRecurringList } from "./recurring-list.js";
import { updateCategorySelect } from "./select-category.js";
import { updateEntriesList } from "./entries-list.js";

export function editRecurrentPopup() {
  const editRecurrentForm = document.getElementById("edit-recurrent-form");
  const editRecurrentPopup = document.getElementById("edit-recurrent-popup");
  const typeSelectors = document.querySelectorAll(
    "#edit-recurrent-form .form__field__tab__input"
  );

  const label = document.getElementById("edit-recurrent-form--label");
  const type = document.getElementById("edit-recurrent-form--income");
  const value = document.getElementById("edit-recurrent-form--value");
  const frequency = document.getElementById("edit-recurrent-form--frequency");
  const initialDate = document.getElementById(
    "edit-recurrent-form--initial-date"
  );
  const finalDate = document.getElementById("edit-recurrent-form--final-date");
  const categoryId = document.getElementById("edit-recurrent-form--category");

  editRecurrentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      recurrentId: editRecurrentForm.getAttribute("data-recurrent-id"),
      categoryId: parseInt(categoryId.value) || undefined,
      type: type.checked ? "income" : "expense",
      label: label.value,
      value: parseInt(value.value),
      frequency: parseInt(frequency.value) || 99999,
      initialDate: new Date(initialDate.value).getTime() + MILLISECCONDS_IN_DAY,
      finalDate: new Date(finalDate.value).getTime() + MILLISECCONDS_IN_DAY,
    };

    const updatedRecurrent = await recurrent.update(formData);

    if (!updatedRecurrent) {
      alert("Erro ao editar o registro.");
      return;
    }

    updateRecurringList();
    updateEntriesList();

    editRecurrentPopup.close();
    editRecurrentForm.reset();
  });

  typeSelectors.forEach((input) => {
    input.addEventListener("change", () => {
      updateCategorySelect(
        "edit-recurrent-form--category",
        type.checked ? "income" : "expense"
      );
    });
  });
}
