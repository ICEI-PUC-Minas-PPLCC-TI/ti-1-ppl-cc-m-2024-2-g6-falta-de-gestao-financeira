import category from "../controllers/category.js";

export async function updateCategorySelect(selectId, currentType) {
  const select = document.getElementById(selectId);

  const userCategories = await category.getAllFromUser();

  select.innerHTML = `
    <option value="none">Sem categoria</option>
  `;

  userCategories.forEach(({ id, label, type }) => {
    if (type === currentType) {
      select.insertAdjacentHTML(
        "beforeend",
        `<option value="${id}">${label}</option>`
      );
    }
  });
}
