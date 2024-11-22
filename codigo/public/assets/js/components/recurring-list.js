import { ICONS_NAMES } from "../lib/constants.js";
import category from "../controllers/category.js";
import recurrent from "../controllers/recurrent.js";
import {
  formatDateToDisplay,
  formatDateToInput,
  toMoney,
} from "../lib/util.js";
import { updateCategorySelect } from "./select-category.js";

export async function updateRecurringList() {
  const categories = await category.getAllFromUser();
  const recurring = await recurrent.getAllFromUser();

  const recurringList = document.getElementById("user-recurring");
  recurringList.innerHTML = "";

  recurring.forEach(
    ({
      id,
      label,
      type,
      categoryId,
      frequency,
      initialDate,
      finalDate,
      value,
    }) => {
      const category = categories.filter(
        (category) => category.id === categoryId
      )[0];

      const icon = category && category.icon ? category.icon : undefined;

      recurringList.insertAdjacentHTML(
        "beforeend",
        `
        <li class="popup__content__list__item popup__content__list__item--${
          type === "income" ? "success" : "destructive"
        }">
        ${
          !icon || icon === "none" || !ICONS_NAMES.includes(icon)
            ? "<div></div>"
            : `
              <img
                class="popup__content__list__item__icon"
                src="assets/img/icon/selectable/${icon}.svg"
                alt="category ${category.label} icon"
              />
            `
        }
        <div class="popup__content__list__item__title">
          <div>
            <b>R$ ${toMoney(value)}</b>
            <span> - ${label}</span>
          </div>

          <div>
            <i>
              a cada ${frequency} ${frequency === 1 ? "dia" : "dias"}
            </i>
            <i>
              de ${formatDateToDisplay(new Date(initialDate))}
              até ${formatDateToDisplay(new Date(finalDate))}
            </i>
          </div>
        </div>        
        <button
          id="button-edit-recurrent-${id}"
          class="popup__content__list__item__edit"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-pencil"
          >
            <path
              d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
            />
            <path d="m15 5 4 4" />
          </svg>
        </button>
        <button
          id="button-delete-recurrent-${id}"
          class="popup__content__list__item__delete"
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

      const editButton = document.getElementById(`button-edit-recurrent-${id}`);
      const deleteButton = document.getElementById(
        `button-delete-recurrent-${id}`
      );

      editButton.addEventListener("click", async () => {
        const editRecurrentForm = document.getElementById(
          "edit-recurrent-form"
        );
        const editRecurrentPopup = document.getElementById(
          "edit-recurrent-popup"
        );

        editRecurrentForm.setAttribute("data-recurrent-id", id);

        document.getElementById("edit-recurrent-form--label").value = label;
        document.getElementById("edit-recurrent-form--value").value = value;

        await updateCategorySelect("edit-recurrent-form--category", type);

        document.getElementById("edit-recurrent-form--category").value =
          categoryId || "none";

        document.getElementById("edit-recurrent-form--frequency").value =
          frequency;
        document.getElementById("edit-recurrent-form--initial-date").value =
          formatDateToInput(new Date(initialDate));
        document.getElementById("edit-recurrent-form--final-date").value =
          formatDateToInput(new Date(finalDate));

        if (type === "income") {
          document.getElementById("edit-recurrent-form--income").checked = true;
        } else {
          document.getElementById(
            "edit-recurrent-form--expense"
          ).checked = true;
        }

        editRecurrentPopup.showModal();
      });

      deleteButton.addEventListener("click", async () => {
        if (
          confirm(
            `Você tem certeza que quer deletar a categoria: "${label}"? Essa ação não pode ser desfeita!`
          )
        ) {
          const deleted = await recurrent.delete(id);

          if (deleted) {
            updateCategoriesList();
          } else {
            alert("Não foi possível deletar a categoria, tente novamente.");
          }
        }
      });
    }
  );
}
