import goal from "../controllers/goal.js";
import { updateGoalsList } from "./goals-list.js";
import { updateCategorySelect } from "./select-category.js";

export function createGoalPopup() {
  const createGoalForm = document.getElementById("create-goal-form");
  const createGoalPopup = document.getElementById("create-goal-popup");
  const typeSelectors = document.querySelectorAll(
    "#create-goal-form .form__field__tab__input"
  );

  const label = document.getElementById("create-goal-form--label");
  const type = document.getElementById("create-goal-form--income");
  const value = document.getElementById("create-goal-form--value");
  const initialDate = document.getElementById("create-goal-form--initial-date");
  const finalDate = document.getElementById("create-goal-form--final-date");
  const categoryId = document.getElementById("create-goal-form--category");

  createGoalForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const time = new Date().getTime();

    const formData = {
      categoryId: parseInt(categoryId.value) || undefined,
      label: label.value,
      type: type.checked ? "income" : "expense",
      value: parseFloat(value.value),
      initialDate: new Date(initialDate.value).getTime(),
      finalDate: new Date(finalDate.value).getTime(),
      createdAt: time,
      updatedAt: time,
    };

    const newGoal = await goal.create(formData);

    if (!newGoal) {
      alert("Erro ao criar o registro recorrente.");
      return;
    }

    updateGoalsList();

    createGoalPopup.close();
    createGoalForm.reset();
  });

  typeSelectors.forEach((input) => {
    input.addEventListener("change", () => {
      updateCategorySelect(
        "create-goal-form--category",
        type.checked ? "income" : "expense"
      );
    });
  });

  updateCategorySelect("create-goal-form--category", "income");
}
