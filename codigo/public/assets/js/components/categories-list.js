import category from "../controllers/category.js";
import { ICONS_NAMES } from "../lib/constants.js";

export async function updateUserCategoriesList() {
  const userCategories = await category.getAllFromUser();

  const categoriesList = document.getElementById("user-categories");
  categoriesList.innerHTML = "";

  userCategories.forEach(({ id, label, icon, type }) => {
    categoriesList.insertAdjacentHTML(
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
                alt="category ${label} icon"
              />
        `
        }
        <p class="popup__content__list__item__title">${label}</p>
        <button
          id="button-edit-category-${id}"
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
          id="button-delete-category-${id}"
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

    const editButton = document.getElementById(`button-edit-category-${id}`);
    const deleteButton = document.getElementById(
      `button-delete-category-${id}`
    );

    editButton.addEventListener("click", async () => {
      const editCategoryForm = document.getElementById("edit-category-form");
      const editCategoryPopup = document.getElementById("edit-category-popup");

      editCategoryForm.setAttribute("data-category-id", id);

      document.getElementById("edit-category-form--label").value = label;

      if (type === "income") {
        document.getElementById("edit-category-form--income").checked = true;
      } else {
        document.getElementById("edit-category-form--expense").checked = true;
      }

      if (icon && icon !== "none" && ICONS_NAMES.includes(icon)) {
        document.getElementById(`edit-category-icon--${icon}`).checked = true;
      }
      document.querySelector(".edit-category-form ");

      editCategoryPopup.showModal();
    });

    deleteButton.addEventListener("click", async () => {
      if (
        confirm(
          `Você tem certeza que quer deletar a categoria: "${label}"? Essa ação não pode ser desfeita!`
        )
      ) {
        const deleted = await category.delete(id);

        if (deleted) {
          updateUserCategoriesList();
        } else {
          alert("Não foi possível deletar a categoria, tente novamente.");
        }
      }
    });
  });
}
