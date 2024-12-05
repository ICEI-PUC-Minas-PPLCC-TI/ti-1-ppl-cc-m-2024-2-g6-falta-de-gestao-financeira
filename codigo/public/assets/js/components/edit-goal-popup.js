import goal from "../controllers/goal.js";

import { MILLISECCONDS_IN_DAY } from "../lib/constants.js";

import { updateGoalsList } from "./goals-list.js";
import { updateCategorySelect } from "./select-category.js";
import { updateEntriesList } from "./entries-list.js";

export function editGoalPopup() {
  const editGoalForm = document.getElementById("edit-goal-form");
  const editGoalPopup = document.getElementById("edit-goal-popup");
  const typeSelectors = document.querySelectorAll(
    "#edit-goal-form .form__field__tab__input"
  );

  const label = document.getElementById("edit-goal-form--label");
  const type = document.getElementById("edit-goal-form--income");
  const value = document.getElementById("edit-goal-form--value");
  const initialDate = document.getElementById("edit-goal-form--initial-date");
  const finalDate = document.getElementById("edit-goal-form--final-date");
  const categoryId = document.getElementById("edit-goal-form--category");

  editGoalForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = {
      goalId: editGoalForm.getAttribute("data-goal-id"),
      categoryId: parseInt(categoryId.value) || undefined,
      type: type.checked ? "income" : "expense",
      label: label.value,
      value: parseFloat(value.value),
      initialDate: new Date(initialDate.value).getTime() + MILLISECCONDS_IN_DAY,
      finalDate: new Date(finalDate.value).getTime() + MILLISECCONDS_IN_DAY,
    };

    const updatedGoal = await goal.update(formData);

    if (!updatedGoal) {
      alert("Erro ao editar a meta.");
      return;
    }

    updateGoalsList();

    editGoalPopup.close();
    editGoalForm.reset();
  });

  typeSelectors.forEach((input) => {
    input.addEventListener("change", () => {
      updateCategorySelect(
        "edit-goal-form--category",
        type.checked ? "income" : "expense"
      );
    });
  });
}
