import recurrent from "../controllers/recurrent.js";

import { updateRecurringList } from "./recurring-list.js";
import { updateCategorySelect } from "./select-category.js";

export function createRecurrentPopup() {
  const createRecurrentForm = document.getElementById("create-recurrent-form");
  const createRecurrentPopup = document.getElementById(
    "create-recurrent-popup"
  );
  const typeSelectors = document.querySelectorAll(
    "#create-recurrent-form .form__field__tab__input"
  );

  const label = document.getElementById("create-recurrent-form--label");
  const type = document.getElementById("create-recurrent-form--income");
  const value = document.getElementById("create-recurrent-form--value");
  const frequency = document.getElementById("create-recurrent-form--frequency");
  const initialDate = document.getElementById(
    "create-recurrent-form--initial-date"
  );
  const finalDate = document.getElementById(
    "create-recurrent-form--final-date"
  );
  const categoryId = document.getElementById("create-recurrent-form--category");

  createRecurrentForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const time = new Date().getTime();

    const formData = {
      categoryId: parseInt(categoryId.value) || undefined,
      label: label.value,
      type: type.checked ? "income" : "expense",
      frequency: frequency.value,
      initialDate: new Date(initialDate.value).getTime(),
      finalDate: new Date(finalDate.value).getTime(),
      value: value.value,
      createdAt: time,
      updatedAt: time,
    };

    const newRecurrent = await recurrent.create(formData);

    if (!newRecurrent) {
      alert("Erro ao criar o registro recorrente.");
      return;
    }

    updateRecurringList();

    createRecurrentPopup.close();
    createRecurrentForm.reset();
  });

  typeSelectors.forEach((input) => {
    input.addEventListener("change", () => {
      updateCategorySelect(
        "create-recurrent-form--category",
        type.checked ? "income" : "expense"
      );
    });
  });

  updateCategorySelect("create-recurrent-form--category", "income");
}
