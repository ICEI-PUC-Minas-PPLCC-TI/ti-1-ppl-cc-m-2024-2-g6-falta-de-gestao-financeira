import { updateUserCategoriesList } from "./categories-list.js";
import category from "../controllers/category.js";
import { auth } from "../lib/auth.js";

export function editCategoryPopup() {
  const editCategoryForm = document.getElementById("edit-category-form");
  const editCategoryPopup = document.getElementById("edit-category-popup");
  const typeSelectors = document.querySelectorAll(
    "#edit-entrie-form .form__field__tab__input"
  );

  editCategoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = auth();

    if (!user) {
      alert("Não Autorizado");
      return;
    }

    const id = editCategoryForm.getAttribute("data-category-id");

    if (!id || id === "") {
      alert("Houve algum erro, tente novamente");
      editCategoryPopup.close();
      return;
    }

    const categoryId = parseInt(id);

    const label = document.getElementById("edit-category-form--label").value;

    if (label === "") {
      alert("Forneça um título");
      return;
    }

    const type = document.getElementById("edit-category-form--income").checked
      ? "income"
      : "expense";

    let icon = document
      .querySelector(
        "#edit-category-form .form__field__icons__item__input:checked"
      )
      .getAttribute("data-icon-name");

    if (icon === "none") icon = undefined;

    const updatedCategory = await category.update({
      categoryId,
      icon,
      label,
      type,
    });

    if (!updatedCategory) {
      alert("Erro interno do servidor, tente novamente");
      return;
    }

    updateUserCategoriesList();

    editCategoryPopup.close();
    editCategoryForm.reset();
  });

  typeSelectors.forEach((input) => {
    input.addEventListener("change", async () => {
      updateSelectCategories();
    });
  });

  updateSelectCategories();
}

async function updateSelectCategories() {
  const entrieType = document.getElementById("edit-entrie-form--income").checked
    ? "income"
    : "expense";

  const userCategories = await category.getAllFromUser();

  const select = document.getElementById("edit-entrie-form--category");
  select.innerHTML = `
    <option value="none">Sem categoria</option>
  `;

  userCategories.forEach(({ id, label, type }) => {
    if (type === entrieType) {
      select.insertAdjacentHTML(
        "beforeend",
        `<option value="${id}">${label}</option>`
      );
    }
  });
}
