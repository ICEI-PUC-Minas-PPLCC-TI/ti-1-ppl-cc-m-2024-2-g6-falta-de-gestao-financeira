import category from "../controllers/category.js";
import goal from "../controllers/goal.js";

import { ICONS_NAMES } from "../lib/constants.js";
import {
  formatDateToDisplay,
  formatDateToInput,
  toMoney,
} from "../lib/util.js";

import { updateCategorySelect } from "./select-category.js";

export async function updateGoalsList() {
  const goals = await goal.getAllFromUser();

  const goalsList = document.querySelector(".goals-list");
  goalsList.innerHTML = "";

  const editGoalForm = document.getElementById("edit-goal-form");
  const editGoalPopup = document.getElementById("edit-goal-popup");

  const userCategories = await category.getAllFromUser();

  goals.forEach(
    ({ id, type, categoryId, value, label, initialDate, finalDate }) => {
      const isIncome = type === "income";

      const category = userCategories.filter((category) => {
        return category.id === categoryId;
      })[0];

      goalsList.insertAdjacentHTML(
        "beforeend",
        `
    <li class="goals-list__item">
      ${
        category && category.icon && ICONS_NAMES.includes(category.icon)
          ? `<img
              class="goals-list__item__icon"
              src="./assets/img/icon/selectable/${category.icon}.svg"
              alt="icon"
            />`
          : "<div></div>"
      }

      <span class="goals-list__item__value${
        isIncome
          ? " goals-list__item__value--income"
          : " goals-list__item__value--expense"
      }">${isIncome ? "" : "-"}R$ ${toMoney(value)}</span>

      <div class="goals-list__item__text">
        <span class="goals-list__item__text__title">${label}</span>

        <i class="goals-list__item__text__time">
          de ${formatDateToDisplay(new Date(initialDate))}
          até ${formatDateToDisplay(new Date(finalDate))}
        </i>
      </div>

      <button
        class="goals-list__item__button goals-list__item__button--edit"
        id="button-edit-goal-${id}"
        type="button"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
          />
          <path d="m15 5 4 4" />
        </svg>
      </button>
      <button
        class="goals-list__item__button goals-list__item__button--delete"
        id="button-delete-goal-${id}"
        type="button"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" x2="10" y1="11" y2="17" />
          <line x1="14" x2="14" y1="11" y2="17" />
        </svg>
      </button>
    </li>
    `
      );

      const editButton = document.getElementById(`button-edit-goal-${id}`);
      const deleteButton = document.getElementById(`button-delete-goal-${id}`);

      editButton.addEventListener("click", async () => {
        editGoalForm.setAttribute("data-goal-id", id);

        document.getElementById("edit-goal-form--label").value = label;

        document.getElementById("edit-goal-form--initial-date").value =
          formatDateToInput(new Date(initialDate));

        document.getElementById("edit-goal-form--final-date").value =
          formatDateToInput(new Date(finalDate));

        document.getElementById("edit-goal-form--value").value = value;

        await updateCategorySelect("edit-goal-form--category", type);

        document.getElementById("edit-goal-form--category").value = categoryId;

        if (type === "income") {
          document.getElementById("edit-goal-form--income").checked = true;
        } else {
          document.getElementById("edit-goal-form--expense").checked = true;
        }

        editGoalPopup.showModal();
      });

      deleteButton.addEventListener("click", async () => {
        if (!confirm("Tem certeza que deseja excluir esta meta?")) return;

        const deleted = await goal.delete(id);

        if (!deleted) {
          alert("Erro ao deletar a meta.");
          return;
        }

        updateGoalsList();
      });
    }
  );
}
