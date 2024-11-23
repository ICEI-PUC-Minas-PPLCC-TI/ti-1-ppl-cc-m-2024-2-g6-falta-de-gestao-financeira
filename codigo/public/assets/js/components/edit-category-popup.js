import { updateCategoriesList } from "./categories-list.js";
import category from "../controllers/category.js";
import { auth } from "../lib/auth.js";
import { updateCategorySelect } from "./select-category.js";

export function editCategoryPopup() {
  const editCategoryForm = document.getElementById("edit-category-form");
  const editCategoryPopup = document.getElementById("edit-category-popup");

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

    const categoryId = parseInt(id) || undefined;

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

    updateCategoriesList();

    await updateCategorySelect(
      "edit-entry-form--category",
      document.getElementById("edit-entry-form--income").checked
        ? "income"
        : "expense"
    );

    await updateCategorySelect(
      "create-entry-form--category",
      document.getElementById("create-entry-form--income").checked
        ? "income"
        : "expense"
    );

    await updateCategorySelect(
      "create-recurrent-form--category",
      document.getElementById("create-recurrent-form--income").checked
        ? "income"
        : "expense"
    );

    await updateCategorySelect(
      "edit-recurrent-form--category",
      document.getElementById("edit-recurrent-form--income").checked
        ? "income"
        : "expense"
    );

    editCategoryPopup.close();
    editCategoryForm.reset();
  });
}
