import category from "../controllers/category.js";
import { auth } from "../lib/auth.js";
import { updateCategoriesList } from "./categories-list.js";

export function createCategoryPopup() {
  const createCategoryForm = document.getElementById("create-category-form");
  const createCategoryPopup = document.getElementById("create-category-popup");

  createCategoryForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = auth();

    if (!user) {
      alert("Não Autorizado");
      return;
    }

    const label = document.getElementById("create-category-form--label").value;

    if (label === "") {
      alert("Forneça um título");
      return;
    }

    const type = document.getElementById("create-category-form--income").checked
      ? "income"
      : "expense";

    let icon = document
      .querySelector(
        "#create-category-form .form__field__icons__item__input:checked"
      )
      .getAttribute("data-icon-name");

    if (icon === "none") icon = undefined;

    const newCategory = await category.create({ icon, label, type });

    if (!newCategory) {
      alert("Erro interno do servidor, tente novamente");
      return;
    }

    updateCategoriesList();

    createCategoryPopup.close();
    createCategoryForm.reset();
  });
}
